
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:5000";
const MAX_IMAGE_SIZE = 1024 * 1024;

type ProfileForm = {
  fullName: string;
  headline: string;
  email: string;
  contactEmail: string;
  phone: string;
  location: string;
  course: string;
  college: string;
  graduationYear: string;
  bio: string;
  github: string;
  linkedin: string;
  photoUrl: string;
};

const initialForm: ProfileForm = {
  fullName: "",
  headline: "",
  email: "",
  contactEmail: "",
  phone: "",
  location: "",
  course: "",
  college: "",
  graduationYear: "",
  bio: "",
  github: "",
  linkedin: "",
  photoUrl: "",
};

const navigation = [
  ["Overview", "/dashboard"],
  ["My Profile", "/dashboard/profile"],
  ["Education", "/dashboard/education"],
  ["Projects", "/dashboard/projects"],
  ["Skills", "/dashboard/skills"],
  ["Achievements", "/dashboard/achievements"],
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#58866a] focus:ring-2 focus:ring-[#58866a]/20";

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const savedUser = localStorage.getItem("studentfolio-user");

        if (!savedUser) {
          throw new Error("Please log in first to load your profile.");
        }

        const user = JSON.parse(savedUser);

        if (!user.id) {
          throw new Error("User ID not found. Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/api/profile/${user.id}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load profile.");
        }

        const profile = result.profile;
        console.log("Profile API result:", result);
        setForm({
          fullName: profile?.fullName || user.name || "",
          headline: profile?.headline || "",
          email: user.email || "",
          contactEmail: profile?.contactEmail ?? "",
          phone: profile?.phone || "",
          location: profile?.city || "",
          course: profile?.course || "",
          college: profile?.college || "",
          graduationYear: profile?.graduationYear?.toString() || "",
          bio: profile?.about || "",
          github: profile?.github || "",
          linkedin: profile?.linkedin || "",
          photoUrl: profile?.photoUrl || "",
        });
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function handlePhotoUrlChange(value: string) {
    setForm((previous) => ({
      ...previous,
      photoUrl: value,
    }));

    setPhotoError("");
    setMessage("");
  }

  function handlePhotoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setPhotoError("Image must be 1 MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((previous) => ({
          ...previous,
          photoUrl: reader.result as string,
        }));
        setPhotoError("");
        setMessage("");
      }
    };

    reader.onerror = () => {
      setPhotoError("Could not read this image. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setForm((previous) => ({
      ...previous,
      photoUrl: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setPhotoError("");
    setMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const savedUser = localStorage.getItem("studentfolio-user");

      if (!savedUser) {
        throw new Error("Please log in before saving your profile.");
      }

      const user = JSON.parse(savedUser);

      if (!user.id) {
        throw new Error("User ID not found. Please log in again.");
      }

      const photo = form.photoUrl.trim();

      if (
        photo &&
        !photo.startsWith("data:image/") &&
        !/^https?:\/\/\S+$/i.test(photo)
      ) {
        throw new Error(
          "Enter a valid image URL beginning with https:// or http://."
        );
      }

      const response = await fetch(
        `${API_URL}/api/profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.fullName.trim(),
            headline: form.headline.trim(),
            email: form.email.trim(),
            contactEmail: form.contactEmail.trim(),
            phone: form.phone.trim(),
            city: form.location.trim(),
            course: form.course.trim(),
            college: form.college.trim(),
            graduationYear: form.graduationYear || null,
            about: form.bio.trim(),
            github: form.github.trim(),
            linkedin: form.linkedin.trim(),
            photoUrl: photo,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save profile.");
      }

      const updatedForm = { ...form, photoUrl: photo };

      setForm(updatedForm);
      localStorage.setItem(
        "studentfolio-profile",
        JSON.stringify(updatedForm)
      );

      setMessage(
        "Profile saved successfully! Open your portfolio to check the changes."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  const personalFields = [
    {
      label: "Full name",
      name: "fullName",
      placeholder: "Your full name",
      required: true,
    },
    {
      label: "Professional headline",
      name: "headline",
      placeholder: "e.g. Aspiring Software Developer",
    },
    {
      label: "Email address",
      name: "email",
      placeholder: "you@example.com",
      type: "email",
      required: true,
    },
    {
  label: "Portfolio Contact Email",
  name: "contactEmail",
  placeholder: "e.g. yourname@gmail.com",
  type: "email",
},
    {
      label: "Phone number",
      name: "phone",
      placeholder: "Your contact number",
      type: "tel",
    },
    {
      label: "City / Location",
      name: "location",
      placeholder: "e.g. Hyderabad",
    },
    {
      label: "Course / Degree",
      name: "course",
      placeholder: "e.g. B.Tech Computer Science",
    },
    {
      label: "College / University",
      name: "college",
      placeholder: "Your institution",
    },
    {
      label: "Graduation year",
      name: "graduationYear",
      placeholder: "e.g. 2028",
      type: "number",
    },
  ];

  const socialFields = [
    {
      label: "GitHub profile",
      name: "github",
      placeholder: "https://github.com/username",
    },
    {
      label: "LinkedIn profile",
      name: "linkedin",
      placeholder: "https://linkedin.com/in/username",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f7f3] text-[#1b3025] md:flex">
      <aside className="bg-[#183c2c] p-5 text-white md:min-h-screen md:w-64 md:shrink-0 md:p-6">
        <Link href="/" className="text-xl font-bold">
          Student<span className="text-green-300">Folio</span>
        </Link>

        <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-widest text-green-200">
          Workspace
        </p>

        <nav className="flex flex-wrap gap-2 md:flex-col">
          {navigation.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className={`rounded-xl px-4 py-3 text-sm ${
                label === "My Profile"
                  ? "bg-white/15 font-semibold"
                  : "text-green-100 hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-[#183c2c]"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#58866a]">
            Your professional identity
          </p>
          <h1 className="mt-2 text-3xl font-bold">My Profile</h1>
          <p className="mt-2 text-gray-500">
            Tell recruiters who you are and what you want to achieve.
          </p>
        </div>

        {loading ? (
          <p className="mt-8 text-gray-500">Loading your profile...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 max-w-4xl space-y-7"
          >
            <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold">Profile photo</h2>
              <p className="mt-1 text-sm text-gray-500">
                Upload a photo from your computer or paste an image URL.
              </p>

              <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#dce5da] bg-[#eaf1e7] text-3xl font-bold text-[#315c43]">
                  {form.photoUrl ? (
                    <img
                      src={form.photoUrl}
                      alt="Profile photo preview"
                      className="h-full w-full object-cover"
                      onError={() =>
                        setPhotoError(
                          "This image could not be displayed. Check the URL."
                        )
                      }
                    />
                  ) : (
                    form.fullName.trim().charAt(0).toUpperCase() || "S"
                  )}
                </div>

                <div className="w-full flex-1">
                  <label
                    htmlFor="photoUpload"
                    className="mb-2 block text-sm font-medium"
                  >
                    Upload from computer
                  </label>

                  <input
                    ref={fileInputRef}
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#eaf1e7] file:px-4 file:py-2 file:font-semibold file:text-[#28583f] hover:file:bg-[#dcebd7]"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Images only. Maximum size: 1 MB.
                  </p>

                  <div className="mt-5">
                    <label
                      htmlFor="photoUrl"
                      className="mb-2 block text-sm font-medium"
                    >
                      Or enter an image URL
                    </label>

                    <input
                      id="photoUrl"
                      type="url"
                      value={
                        form.photoUrl.startsWith("data:image/")
                          ? ""
                          : form.photoUrl
                      }
                      onChange={(event) =>
                        handlePhotoUrlChange(event.target.value)
                      }
                      placeholder="https://example.com/my-photo.jpg"
                      className={inputClass}
                    />
                  </div>

                  {form.photoUrl && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="mt-3 text-sm font-semibold text-red-600 hover:underline"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              {photoError && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {photoError}
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold">Personal information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Add the details you want to showcase on your portfolio.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {personalFields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-medium"
                    >
                      {field.label}
                    </label>

                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type || "text"}
                      required={field.required}
                      min={field.name === "graduationYear" ? 1900 : undefined}
                      max={field.name === "graduationYear" ? 2200 : undefined}
                      value={form[field.name as keyof ProfileForm]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium"
                >
                  About me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  maxLength={1000}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Write about yourself, your interests, and your career goals..."
                  className={`${inputClass} resize-y`}
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {form.bio.length}/1000 characters
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold">Professional links</h2>
              <p className="mt-1 text-sm text-gray-500">
                Help people find your work online.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {socialFields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-medium"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="url"
                      value={form[field.name as keyof ProfileForm]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </section>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className="rounded-xl bg-[#eaf1e7] p-4 text-sm text-[#28583f]"
              >
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#183c2c] px-6 py-3.5 font-semibold text-white transition hover:bg-[#28583f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save profile →"}
              </button>

              <Link
                href="/dashboard"
                className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
