import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
function authenticateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: number };

    res.locals.userId = decoded.userId;
    next();
  } catch(error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Home API
app.get("/", (_req, res) => {
  res.json({
    message: "Student Portfolio Builder API is running!",
  });
});

// Database health check
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$connect();
    const users = await prisma.user.count();

    res.json({
      status: "success",
      database: "connected",
      users,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      res.status(400).json({
        message: "Name, email, and password (minimum 8 characters) are required.",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      res.status(409).json({ message: "This email is already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Registration successful!",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET as string,
  { expiresIn: "1d" }
);

res.json({
  message: "Login successful!",
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed." });
  }
});

// Get profile
app.get("/api/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot access another user's profile.",
  });
}
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ message: "Invalid user ID." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
     const safeProfile = profile ?? {
  fullName: user.name ?? "",
  headline: "",
  phone: "",
  contactEmail: "",
  city: "",
  course: "",
  college: "",
  graduationYear: null,
  about: "",
  photoUrl: "",
  github: "",
  linkedin: "",
};
  res.json({ user, profile: safeProfile });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

// Create or update profile
app.put("/api/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot update another user's profile.",
  });
}
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ message: "Invalid user ID." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const {
      fullName,
      headline,
      phone,
      contactEmail,
      city,
      course,
      college,
      graduationYear,
      about,
      photoUrl,
      github,
      linkedin,
    } = req.body;

    const textFields = {
      fullName,
      headline,
      phone,
      contactEmail,
      city,
      course,
      college,
      about,
      photoUrl,
      github,
      linkedin,
    };

    for (const [field, value] of Object.entries(textFields)) {
      if (value !== undefined && typeof value !== "string") {
        res.status(400).json({ message: `${field} must be text.` });
        return;
      }
    }

    let parsedYear: number | null | undefined;

    if (graduationYear !== undefined) {
      if (graduationYear === null || graduationYear === "") {
        parsedYear = null;
      } else {
        parsedYear = Number(graduationYear);

        if (
          !Number.isInteger(parsedYear) ||
          parsedYear < 1900 ||
          parsedYear > 2200
        ) {
          res.status(400).json({
            message: "Enter a valid graduation year.",
          });
          return;
        }
      }
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: fullName ?? "",
        headline: headline ?? "",
        phone: phone ?? "",
        contactEmail: contactEmail ?? "",
        city: city ?? "",
        course: course ?? "",
        college: college ?? "",
        graduationYear: parsedYear ?? null,
        about: about ?? "",
        photoUrl: photoUrl ?? "",
        github: github ?? "",
        linkedin: linkedin ?? "",
      },
      update: {
        ...(fullName !== undefined && { fullName }),
        ...(headline !== undefined && { headline }),
        ...(phone !== undefined && { phone }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(city !== undefined && { city }),
        ...(course !== undefined && { course }),
        ...(college !== undefined && { college }),
        ...(parsedYear !== undefined && { graduationYear: parsedYear }),
        ...(about !== undefined && { about }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(github !== undefined && { github }),
        ...(linkedin !== undefined && { linkedin }),
      },
    });

    // Keep the account name in sync with the profile's full name.
    if (typeof fullName === "string" && fullName.trim()) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: fullName.trim() },
      });
    }

    res.json({
      message: "Profile saved successfully!",
      profile,
    });
  } catch (error) {
    console.error("Save profile error:", error);
if (error instanceof Error) {
  console.error(error.stack);
}
    res.status(500).json({ message: "Failed to save profile." });
  }
});


/* EDUCATION API */

// Get all education records for a user
app.get("/api/education/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot access another user's education.",
  });
}
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const education = await prisma.education.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ education });
  } catch (error) {
    console.error("Get education error:", error);
    return res.status(500).json({
      message: "Failed to fetch education records.",
    });
  }
});

// Add education record
app.post("/api/education/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot add education for another user.",
  });
}
    const {
  degree,
  institution,
  field,
  startYear,
  endYear,
  grade,
  description,
} = req.body;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (
      typeof degree !== "string" ||
      !degree.trim() ||
      typeof institution !== "string" ||
      !institution.trim()
    ) {
      return res.status(400).json({
        message: "Degree and institution are required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const validYear = (value: unknown) =>
      value === "" || value === null || value === undefined
        ? null
        : Number.isInteger(Number(value)) &&
            Number(value) >= 1900 &&
            Number(value) <= 2200
          ? Number(value)
          : NaN;

    const parsedStartYear = validYear(startYear);
    const parsedEndYear = validYear(endYear);

    if (Number.isNaN(parsedStartYear) || Number.isNaN(parsedEndYear)) {
      return res.status(400).json({ message: "Enter valid years." });
    }

    const education = await prisma.education.create({
      data: {
        userId,
        degree: degree.trim(),
        institution: institution.trim(),
        field: typeof field === "string" ? field.trim() : "",
        startYear: parsedStartYear,
        endYear: parsedEndYear,
        grade: typeof grade === "string" ? grade.trim() : "",
        description:
          typeof description === "string" ? description.trim() : "",
      },
    });

    return res.status(201).json({
      message: "Education added successfully.",
      education,
    });
  } catch (error) {
    console.error("Add education error:", error);
    return res.status(500).json({
      message: "Failed to add education record.",
    });
  }
});

// Delete education record
app.delete(
  "/api/education/:userId/:educationId",
  authenticateToken,
  async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot delete another user's education.",
  });
}
    const educationId = Number(req.params.educationId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(educationId) ||
      educationId <= 0
    ) {
      return res.status(400).json({ message: "Invalid ID." });
    }

    const record = await prisma.education.findFirst({
      where: { id: educationId, userId },
    });

    if (!record) {
      return res.status(404).json({
        message: "Education record not found.",
      });
    }

    await prisma.education.delete({
      where: { id: educationId },
    });

    return res.json({ message: "Education deleted successfully." });
  } catch (error) {
    console.error("Delete education error:", error);
    return res.status(500).json({
      message: "Failed to delete education record.",
    });
  }
});
// GET all projects
app.get("/api/projects/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({ message: "You cannot access another user's projects." });
}
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Failed to load projects." });
  }
});

// ADD project
app.post("/api/projects/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot add projects for another user.",
  });
}
    const { title, description, technologies, github, demo } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Project title is required." });
    }

    const project = await prisma.project.create({
      data: {
        userId,
        title: title.trim(),
        description: description ?? "",
        technologies: technologies ?? "",
        github: github ?? "",
        demo: demo ?? "",
      },
    });

    res.status(201).json({
      message: "Project saved successfully.",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Failed to save project." });
  }
});
// Skills API - Get all skills for a user
app.get("/api/skills/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot access another user's skills.",
  });
}
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ skills });
  } catch (error) {
    console.error("Get skills error:", error);
    return res.status(500).json({ message: "Failed to load skills." });
  }
});

// Skills API - Add a skill
app.post("/api/skills/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot add skills for another user.",
  });
}
    const { name, category, level } = req.body;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof level !== "string" ||
      !level.trim()
    ) {
      return res.status(400).json({
        message: "Skill name, category, and level are required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingSkill = await prisma.skill.findFirst({
      where: {
        userId,
        name: { equals: name.trim(), mode: "insensitive" },
      },
    });

    if (existingSkill) {
      return res.status(409).json({
        message: "This skill has already been added.",
      });
    }

    const skill = await prisma.skill.create({
      data: {
        userId,
        name: name.trim(),
        category: category.trim(),
        level: level.trim(),
      },
    });

    return res.status(201).json({
      message: "Skill added successfully!",
      skill,
    });
  } catch (error) {
    console.error("Create skill error:", error);
    return res.status(500).json({ message: "Failed to save skill." });
  }
});

// Skills API - Delete a skill
app.delete("/api/skills/:userId/:skillId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const skillId = Number(req.params.skillId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(skillId) ||
      skillId <= 0
    ) {
      return res.status(400).json({ message: "Invalid user or skill ID." });
    }

    const skill = await prisma.skill.findFirst({
      where: { id: skillId, userId },
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    await prisma.skill.delete({
      where: { id: skillId },
    });

    return res.status(200).json({ message: "Skill deleted successfully." });
  } catch (error) {
    console.error("Delete skill error:", error);
    return res.status(500).json({ message: "Failed to delete skill." });
  }
});

/* Achievements API */

// Get all achievements
app.get("/api/achievements/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot access another user's achievements.",
  });
}
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ achievements });
  } catch (error) {
    console.error("Get achievements error:", error);
    return res.status(500).json({ message: "Failed to load achievements." });
  }
});

// Add an achievement
app.post("/api/achievements/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot add achievements for another user.",
  });
}
    const { title, type, organization, date, description, certificateUrl } =
      req.body;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Achievement title is required." });
    }

    const achievement = await prisma.achievement.create({
      data: {
        userId,
        title: title.trim(),
        type:
          typeof type === "string" && type.trim()
            ? type.trim()
            : "Certificate",
        organization:
          typeof organization === "string" ? organization.trim() : "",
        date: date ? new Date(date) : null,
        description:
          typeof description === "string" ? description.trim() : "",
        certificateUrl:
          typeof certificateUrl === "string" ? certificateUrl.trim() : "",
      },
    });

    return res.status(201).json({
      message: "Achievement saved successfully.",
      achievement,
    });
  } catch (error) {
    console.error("Create achievement error:", error);
    return res.status(500).json({ message: "Failed to save achievement." });
  }
});

// Delete an achievement
app.delete(
  "/api/achievements/:userId/:achievementId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot delete another user's achievements.",
  });
}
      const achievementId = Number(req.params.achievementId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0 ||
        !Number.isInteger(achievementId) ||
        achievementId <= 0
      ) {
        return res
          .status(400)
          .json({ message: "Invalid user or achievement ID." });
      }

      const existing = await prisma.achievement.findFirst({
        where: { id: achievementId, userId },
      });

      if (!existing) {
        return res.status(404).json({ message: "Achievement not found." });
      }

      await prisma.achievement.delete({
        where: { id: achievementId },
      });

      return res
        .status(200)
        .json({ message: "Achievement deleted successfully." });
    } catch (error) {
      console.error("Delete achievement error:", error);
      return res.status(500).json({ message: "Failed to delete achievement." });
    }
  }
);

/* Delete a project */
app.delete("/api/projects/:userId/:projectId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const projectId = Number(req.params.projectId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot delete another user's project.",
  });
}
    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid user or project ID.",
      });
    }

    const existing = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return res.status(200).json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      message: "Failed to delete project.",
    });
  }
});

/* Update an education record */
app.put(
  "/api/education/:userId/:educationId",
  authenticateToken,
  async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (userId !== res.locals.userId) {
  return res.status(403).json({
    message: "You cannot update another user's education.",
  });
}
    const educationId = Number(req.params.educationId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(educationId) ||
      educationId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid user or education ID.",
      });
    }

    const existing = await prisma.education.findFirst({
      where: { id: educationId, userId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Education record not found.",
      });
    }

    const { degree, institution, field, startYear, endYear, grade, description } =
      req.body;

    if (
      startYear != null &&
      endYear != null &&
      Number(endYear) < Number(startYear)
    ) {
      return res.status(400).json({
        message: "End year cannot be earlier than start year.",
      });
    }

    const updated = await prisma.education.update({
      where: { id: educationId },
      data: {
        ...(typeof degree === "string" && { degree: degree.trim() }),
        ...(typeof institution === "string" && {
          institution: institution.trim(),
        }),
        ...(typeof field === "string" && { field: field.trim() }),
        ...(startYear !== undefined && {
          startYear: startYear === null || startYear === "" ? null : Number(startYear),
        }),
        ...(endYear !== undefined && {
          endYear: endYear === null || endYear === "" ? null : Number(endYear),
        }),
        ...(typeof grade === "string" && { grade: grade.trim() }),
        ...(typeof description === "string" && {
          description: description.trim(),
        }),
      },
    });

    return res.status(200).json({
      message: "Education updated successfully.",
      education: updated,
    });
  } catch (error) {
    console.error("Update education error:", error);
    return res.status(500).json({
      message: "Failed to update education.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
