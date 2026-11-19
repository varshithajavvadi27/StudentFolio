"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type TemplateId = "minimal" | "dark-tech" | "creative" | "professional";

type Profile = {
  name: string;
  headline: string;
  about: string;
  city: string;
  college: string;
  course: string;
  github: string;
  linkedin: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
};

type Education = {
  id: number | string;
  institution: string;
  degree: string;
  field: string;
  startYear: string | number;
  endYear: string | number;
};

type Skill = {
  id: number | string;
  name: string;
  category: string;
  level: string;
};

type Project = {
  id: number | string;
  title: string;
  description: string;
  technologies: string;
  githubUrl: string;
  liveUrl: string;
};

type Achievement = {
  id: number | string;
  title: string;
  type: string;
  organization: string;
  date: string | null;
  description: string;
  certificateUrl: string;
};

const API = "http://localhost:5000";

const defaultProfile: Profile = {
  name: "Student Name",
  headline: "Aspiring Software Developer",
  about:
    "I am passionate about technology, software development, and building useful applications.",
  city: "India",
  college: "Your College",
  course: "B.Tech Computer Science",
  github: "",
  linkedin: "",
  photoUrl: "",
  email: "",
  phone: ""
};

const templates: {
  id: TemplateId;
  name: string;
  description: string;
}[] = [
  { id: "minimal", name: "Minimal", description: "Clean and elegant" },
  { id: "dark-tech", name: "Dark Tech", description: "Modern developer style" },
  { id: "creative", name: "Creative", description: "Bold colours and gradients" },
  { id: "professional", name: "Professional", description: "Formal and polished" },
];
function getArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.education)) return obj.education as T[];
    if (Array.isArray(obj.skills)) return obj.skills as T[];
    if (Array.isArray(obj.projects)) return obj.projects as T[];
    if (Array.isArray(obj.achievements)) return obj.achievements as T[];
  }

  return [];
}

export default function PortfolioPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [templateId, setTemplateId] = useState<TemplateId>("minimal");

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const storedUser = localStorage.getItem("studentfolio-user");

    if (!storedUser) {
      setMessage("Please log in to view your portfolio.");
      setLoading(false);
      return;
    }

    let userId: number;

    try {
      const user = JSON.parse(storedUser);
      userId = Number(typeof user === "object" ? user.id : user);

      if (!Number.isFinite(userId) || userId <= 0) {
        throw new Error("Invalid user ID");
      }
    } catch {
      setMessage("Your login session is invalid. Please log in again.");
      setLoading(false);
      return;
    }

    const endpoints = [
      `${API}/api/profile/${userId}`,
      `${API}/api/education/${userId}`,
      `${API}/api/skills/${userId}`,
      `${API}/api/projects/${userId}`,
      `${API}/api/achievements/${userId}`,
    ];

    try {
      const token = localStorage.getItem("studentfolio-token");

if (!token) {
  throw new Error("Please log in again to view your portfolio.");
}

const responses = await Promise.all(
  endpoints.map((url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )
);

      if (responses.some((response) => !response.ok)) {
        throw new Error(
          "Could not load all portfolio details. Check that your backend is running."
        );
      }

      const [
        profileData,
        educationData,
        skillsData,
        projectsData,
        achievementsData,
      ] = await Promise.all(responses.map((response) => response.json()));

      const profileRecord =
  profileData &&
  typeof profileData === "object" &&
  "profile" in profileData
    ? profileData.profile
    : profileData &&
        typeof profileData === "object" &&
        "data" in profileData
      ? profileData.data
      : profileData;
      setProfile({
        ...defaultProfile,
        ...(profileRecord || {}),
        name:
          profileRecord?.fullName ||
          profileRecord?.name ||
          defaultProfile.name,
      });

      setEducation(getArray<Education>(educationData));
      setSkills(getArray<Skill>(skillsData));
      setProjects(getArray<Project>(projectsData));
      setAchievements(getArray<Achievement>(achievementsData));
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load portfolio details."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  useEffect(() => {
    const saved = localStorage.getItem("studentfolio-template");

    if (
      saved === "minimal" ||
      saved === "dark-tech" ||
      saved === "creative" ||
      saved === "professional"
    ) {
      setTemplateId(saved);
    }
  }, []);

  const chooseTemplate = (id: TemplateId) => {
    setTemplateId(id);
    localStorage.setItem("studentfolio-template", id);
  };

  const dark = templateId === "dark-tech";
  const creative = templateId === "creative";
  const professional = templateId === "professional";

  const pageClass = dark
    ? "min-h-screen bg-[#080d18] text-slate-100"
    : creative
      ? "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-slate-900"
      : professional
        ? "min-h-screen bg-slate-100 text-slate-900"
        : "min-h-screen bg-[#f3f8f4] text-slate-800";

  const cardClass = dark
    ? "rounded-2xl border border-slate-700 bg-slate-900 shadow-xl shadow-black/10"
    : creative
      ? "rounded-3xl border border-purple-100 bg-white shadow-lg shadow-purple-100/50"
      : professional
        ? "rounded-xl border border-slate-200 bg-white shadow-sm"
        : "rounded-2xl border border-emerald-100 bg-white shadow-sm";

  const muted = dark ? "text-slate-300" : "text-slate-600";

  const accent = dark
    ? "text-cyan-300"
    : creative
      ? "text-purple-700"
      : professional
        ? "text-blue-800"
        : "text-emerald-800";

  const badgeClass = dark
    ? "border-cyan-900 bg-slate-800 text-cyan-100"
    : creative
      ? "border-purple-200 bg-purple-50 text-purple-900"
      : professional
        ? "border-blue-100 bg-blue-50 text-blue-900"
        : "border-emerald-100 bg-emerald-50 text-emerald-900";

  return (
    <main className={pageClass}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
              dark
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            ← Dashboard
          </Link>

          <button
            onClick={() => void loadPortfolio()}
            disabled={loading}
            className={`rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60 ${
              dark
                ? "bg-cyan-600 hover:bg-cyan-500"
                : creative
                  ? "bg-purple-700 hover:bg-purple-800"
                  : professional
                    ? "bg-blue-800 hover:bg-blue-900"
                    : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            {loading ? "Loading..." : "↻ Refresh Portfolio"}
          </button>
        </nav>

        <header className="mb-8">
          <p className={`mb-2 text-xs font-bold uppercase tracking-[0.25em] ${accent}`}>
            StudentFolio · Portfolio Studio
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Your portfolio, your style.
          </h1>
          <p className={`mt-2 ${muted}`}>
            Choose a template to change your portfolio design.
          </p>
        </header>

        <section
          aria-label="Choose portfolio template"
          className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {templates.map((template) => {
            const selected = templateId === template.id;

            return (
              <button
                key={template.id}
                onClick={() => chooseTemplate(template.id)}
                aria-pressed={selected}
                className={`rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-1 ${
                  selected
                    ? `border-current ring-2 ring-current/20 ${accent} ${
                        dark ? "bg-slate-900" : "bg-white"
                      }`
                    : dark
                      ? "border-slate-700 bg-slate-900"
                      : "border-slate-200 bg-white"
                }`}
              >
                <span className="block font-bold">{template.name}</span>
                <span className={`mt-1 block text-sm ${muted}`}>
                  {template.description}
                </span>
                {selected && (
                  <span className="mt-3 block text-xs font-bold">
                    ✓ Selected
                  </span>
                )}
              </button>
            );
          })}
        </section>

        {message && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className={`${cardClass} p-12 text-center`}>
            <p className={`text-lg font-semibold ${accent}`}>
              Loading your portfolio...
            </p>
            <p className={`mt-2 text-sm ${muted}`}>
              Fetching your saved details.
            </p>
          </div>
        ) : (
          <>
       <section
  id="about"
className={`${cardClass} mb-6 overflow-hidden ${
  creative
    ? "rounded-[2rem]"
    : professional
      ? "rounded-lg"
      : dark
        ? "rounded-2xl"
        : "rounded-3xl"
}`}
>
  <div
    className={`relative p-7 sm:p-10 ${
      creative
        ? "bg-gradient-to-br from-purple-700 via-pink-600 to-orange-400 text-white"
        : dark
          ? "grid gap-8 md:grid-cols-[1fr_auto] items-center bg-slate-950"
          : professional
            ? "bg-blue-950 text-white"
            : "bg-white text-slate-900 text-center"
    }`}
  >
    <div className={`flex gap-6 ${
      creative
        ? "flex-col"
        : dark
          ? "flex-col-reverse sm:flex-row sm:items-center"
          : professional
            ? "flex-col items-center text-center"
            : "flex-col items-center"
    }`}>
      {profile.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.photoUrl}
          alt={`${profile.name} profile`}
          className={`h-28 w-28 shrink-0 object-cover shadow-lg ${
            creative
              ? "rounded-full border-4 border-white"
              : dark
                ? "rounded-2xl border border-cyan-400"
                : professional
                  ? "rounded-lg border-2 border-white"
                  : "rounded-full border border-slate-200"
          }`}
        />
      ) : (
        <div
          className={`flex h-28 w-28 shrink-0 items-center justify-center text-4xl font-black shadow-lg ${
            creative
              ? "rounded-full bg-white/20 text-white"
              : dark
                ? "rounded-2xl bg-cyan-950 text-cyan-300"
                : professional
                  ? "rounded-lg bg-blue-800 text-white"
                  : "rounded-full bg-emerald-100 text-emerald-900"
          }`}
        >
          {(profile.name || "S").charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0">
        <p className={`mb-2 text-xs font-bold uppercase tracking-[0.2em] ${
          creative ? "text-white/80" : dark ? "text-cyan-300" : professional ? "text-blue-200" : "text-emerald-700"
        }`}>
          Hello, I&apos;m
        </p>
        <h2 className={`break-words font-black ${
          creative ? "text-5xl sm:text-7xl" : dark ? "text-3xl sm:text-5xl" : "text-3xl sm:text-4xl"
        }`}>
          {profile.name}
        </h2>
        <p className={`mt-3 text-lg font-semibold ${
          creative ? "text-white" : dark ? "text-slate-300" : professional ? "text-blue-100" : "text-slate-600"
        }`}>
          {profile.headline}
        </p>
      </div>
    </div>

    <div className={dark ? "md:max-w-sm" : "mt-6"}>
      <p className={`leading-7 ${
        creative ? "text-white/90" : dark ? "text-slate-300" : professional ? "text-blue-100" : "text-slate-600"
      }`}>
        {profile.about}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        {profile.city && <span className="rounded-full border border-current/20 px-3 py-2">📍 {profile.city}</span>}
        {profile.course && <span className="rounded-full border border-current/20 px-3 py-2">🎓 {profile.course}</span>}
        {profile.college && <span className="rounded-full border border-current/20 px-3 py-2">🏫 {profile.college}</span>}
      </div>
    </div>
  </div>
</section>

            <nav className="mb-6 flex flex-wrap gap-2" aria-label="Portfolio sections">
              {[
                ["Education", "#education"],
                ["Skills", "#skills"],
                ["Projects", "#projects"],
                ["Achievements", "#achievements"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    dark
                      ? "border-slate-700 bg-slate-900 hover:border-cyan-500"
                      : "border-slate-200 bg-white hover:border-emerald-400"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div
              className={`grid gap-6 ${
                professional ? "lg:grid-cols-2" : "lg:grid-cols-2"
              }`}
            >
              <section id="education" className={`${cardClass} p-6 sm:p-7`}>
                <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${accent}`}>
                  My journey
                </p>
                <h3 className="mb-5 text-2xl font-black">🎓 Education</h3>

                {education.length ? (
                  <div className="space-y-4">
                    {education.map((item) => (
                      <article
                        key={item.id}
                        className={`rounded-xl border-l-4 p-4 transition hover:-translate-y-0.5 ${
                          dark
                            ? "border-cyan-400 bg-slate-800"
                            : creative
                              ? "border-purple-500 bg-purple-50"
                              : professional
                                ? "border-blue-800 bg-blue-50"
                                : "border-emerald-600 bg-emerald-50"
                        }`}
                      >
                        <h4 className="font-bold">
                          {item.degree || item.field}
                        </h4>
                        <p className={`mt-1 text-sm ${muted}`}>
                          {item.institution}
                        </p>
                        <p className={`mt-2 text-xs font-semibold ${accent}`}>
                          {item.startYear} – {item.endYear}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={muted}>No education details added yet.</p>
                )}
              </section>

              <section id="skills" className={`${cardClass} p-6 sm:p-7`}>
                <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${accent}`}>
                  What I work with
                </p>
                <h3 className="mb-5 text-2xl font-black">⚡ Skills</h3>

                {skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${badgeClass}`}
                      >
                        {skill.name}
                        {skill.level ? ` · ${skill.level}` : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={muted}>No skills added yet.</p>
                )}
              </section>

              <section
                id="projects"
                className={`${cardClass} p-6 sm:p-7 lg:col-span-2`}
              >
                <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${accent}`}>
                  Things I have built
                </p>
                <h3 className="mb-5 text-2xl font-black">🚀 Featured Projects</h3>

                {projects.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {projects.map((project, index) => (
                      <article
                        key={project.id}
                        className={`rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "border-slate-700 bg-slate-800"
                            : creative
                              ? "border-purple-100 bg-purple-50"
                              : professional
                                ? "border-slate-200 bg-slate-50"
                                : "border-emerald-100 bg-emerald-50"
                        }`}
                      >
                        <p className={`mb-2 text-xs font-bold ${accent}`}>
                          PROJECT {String(index + 1).padStart(2, "0")}
                        </p>
                        <h4 className="text-xl font-bold">{project.title}</h4>
                        <p className={`mt-3 text-sm leading-6 ${muted}`}>
                          {project.description}
                        </p>

                        {project.technologies && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.technologies
                              .split(",")
                              .map((technology) => technology.trim())
                              .filter(Boolean)
                              .map((technology) => (
                                <span
                                  key={technology}
                                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}
                                >
                                  {technology}
                                </span>
                              ))}
                          </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`${accent} hover:underline`}
                            >
                              GitHub ↗
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`${accent} hover:underline`}
                            >
                              Live Demo ↗
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={muted}>No projects added yet.</p>
                )}
              </section>

              <section
                id="achievements"
                className={`${cardClass} p-6 sm:p-7`}
              >
                <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${accent}`}>
                  Milestones
                </p>
                <h3 className="mb-5 text-2xl font-black">🏆 Achievements</h3>

                {achievements.length ? (
                  <div className="space-y-4">
                    {achievements.map((item) => (
                      <article
                        key={item.id}
                        className={`rounded-xl border p-4 ${
                          dark
                            ? "border-slate-700 bg-slate-800"
                            : creative
                              ? "border-purple-100 bg-purple-50"
                              : professional
                                ? "border-slate-200 bg-slate-50"
                                : "border-emerald-100 bg-emerald-50"
                        }`}
                      >
                        <h4 className="font-bold">{item.title}</h4>
                        <p className={`mt-1 text-sm ${muted}`}>
                          {item.organization}
                        </p>
                        {item.date && (
                          <p className={`mt-1 text-xs ${accent}`}>
                            {item.date}
                          </p>
                        )}
                        {item.description && (
                          <p className={`mt-3 text-sm leading-6 ${muted}`}>
                            {item.description}
                          </p>
                        )}
                        {item.certificateUrl && (
                          <a
                            href={item.certificateUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`mt-3 inline-block text-sm font-bold ${accent} hover:underline`}
                          >
                            View Certificate ↗
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={muted}>No achievements added yet.</p>
                )}
              </section>

              <section id="contact" className={`${cardClass} p-6 sm:p-7`}>
                <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${accent}`}>
                  Find me online
                </p>
                <h3 className="mb-5 text-2xl font-black">✉️ Let&apos;s Connect</h3>

                <div className="space-y-3">
                  {profile.email && (
  <a
    href={`mailto:${profile.email}`}
    className="block rounded-xl border p-3 text-sm font-semibold hover:underline"
  >
    ✉️ {profile.email}
  </a>
)}

{profile.phone && (
  <a
    href={`tel:${profile.phone}`}
    className="block rounded-xl border p-3 text-sm font-semibold hover:underline"
  >
    📞 {profile.phone}
  </a>
)}
                  {profile.github ? (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className={`block rounded-xl border p-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                        dark
                          ? "border-slate-700 hover:border-cyan-400"
                          : "border-slate-200 hover:border-emerald-400"
                      }`}
                    >
                      GitHub Profile ↗
                    </a>
                  ) : (
                    <p className={muted}>Add your GitHub link from the dashboard.</p>
                  )}

                  {profile.linkedin ? (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={`block rounded-xl border p-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                        dark
                          ? "border-slate-700 hover:border-cyan-400"
                          : "border-slate-200 hover:border-emerald-400"
                      }`}
                    >
                      LinkedIn Profile ↗
                    </a>
                  ) : (
                    <p className={muted}>Add your LinkedIn link from the dashboard.</p>
                  )}
                </div>

                <Link
                  href="/dashboard"
                  className={`mt-6 inline-block text-sm font-bold ${accent} hover:underline`}
                >
                  Edit Portfolio Details →
                </Link>
                <button
  type="button"
  onClick={() => window.print()}
  className={`mt-4 inline-block rounded-lg px-5 py-3 text-sm font-semibold ${
    dark
      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
      : "bg-emerald-700 text-white hover:bg-emerald-800"
  }`}
>
  Download Portfolio PDF ↓
</button>
              </section>
            </div>

            <footer
              className={`mt-8 border-t py-6 text-center text-xs ${
                dark
                  ? "border-slate-800 text-slate-500"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              Built with StudentFolio · Designed to showcase your journey
            </footer>
          </>
        )}
      </div>
    </main>
  );
}