"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Skill = {
  id: number;
  name: string;
  category: string;
  level: string;
};

const API_URL = "http://localhost:5000";

const emptyForm = {
  name: "",
  category: "Programming",
  level: "Intermediate",
};

export default function SkillsPage() {
  const [form, setForm] = useState(emptyForm);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("studentfolio-user");

      if (!savedUser) {
        setMessage("Please log in to manage your skills.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);
      const id = Number(user.id);

      if (!Number.isInteger(id) || id <= 0) {
        setMessage("Invalid user session. Please log in again.");
        setLoading(false);
        return;
      }

      setUserId(id);
      void loadSkills(id);
    } catch {
      setMessage("Unable to read your login details. Please log in again.");
      setLoading(false);
    }
  }, []);

  async function loadSkills(id: number) {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/skills/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load skills.");
      }

      setSkills(data.skills || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setMessage("Please log in before adding a skill.");
      return;
    }

    const name = form.name.trim();

    if (!name) {
      setMessage("Please enter a skill name.");
      return;
    }

    if (skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) {
      setMessage("This skill has already been added.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/skills/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category: form.category,
          level: form.level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save skill.");
      }

      setForm(emptyForm);
      setMessage("Skill saved successfully to the database.");
      await loadSkills(userId);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save the skill."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteSkill(id: number) {
    if (!userId) return;

    setDeletingId(id);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/skills/${userId}/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete skill.");
      }

      setMessage("Skill deleted successfully.");
      await loadSkills(userId);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete the skill."
      );
    } finally {
      setDeletingId(null);
    }
  }

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
          {[
            ["Overview", "/dashboard"],
            ["My Profile", "/dashboard/profile"],
            ["Education", "/dashboard/education"],
            ["Projects", "/dashboard/projects"],
            ["Skills", "/dashboard/skills"],
            ["Achievements", "/dashboard/achievements"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className={`rounded-xl px-4 py-3 text-sm ${
                label === "Skills"
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
            Highlight your strengths
          </p>
          <h1 className="mt-2 text-3xl font-bold">My Skills</h1>
          <p className="mt-2 text-gray-500">
            Show recruiters the tools and technologies you know.
          </p>
        </div>

        <div className="mt-8 grid max-w-6xl gap-7 xl:grid-cols-[0.8fr_1.2fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-3xl border border-gray-100 bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold">Add a skill</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a category and your current proficiency.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Skill name
                </label>
                <input
                  id="name"
                  required
                  maxLength={60}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Python, React, PostgreSQL"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#58866a]"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#58866a]"
                >
                  <option>Programming</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Database</option>
                  <option>Tools & Platforms</option>
                  <option>Soft Skills</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="level"
                  className="mb-2 block text-sm font-medium"
                >
                  Proficiency level
                </label>
                <select
                  id="level"
                  value={form.level}
                  onChange={(e) =>
                    setForm({ ...form, level: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#58866a]"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>

              {message && (
                <p
                  role="status"
                  className="rounded-xl bg-[#eaf1e7] p-3 text-sm text-[#28583f]"
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving || loading || !userId}
                className="w-full rounded-xl bg-[#183c2c] px-5 py-3.5 font-semibold text-white hover:bg-[#28583f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add skill →"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Your skills</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Skills saved to your account.
                </p>
              </div>

              <span className="rounded-full bg-[#eaf1e7] px-3 py-1 text-sm font-semibold text-[#28583f]">
                {skills.length} skills
              </span>
            </div>

            {loading ? (
              <p className="mt-6 text-sm text-gray-500">Loading skills...</p>
            ) : skills.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                <span className="text-3xl">✧</span>
                <p className="mt-3 font-semibold">No skills added yet</p>
                <p className="mt-2 text-sm text-gray-500">
                  Add your first skill using the form.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {skills.map((skill) => (
                  <article
                    key={skill.id}
                    className="rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold">{skill.name}</h3>
                      <button
                        type="button"
                        onClick={() => deleteSkill(skill.id)}
                        disabled={deletingId === skill.id}
                        aria-label={`Delete ${skill.name}`}
                        className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === skill.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {skill.category}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">
                        Proficiency
                      </span>
                      <span className="rounded-full bg-[#eaf1e7] px-3 py-1 text-xs font-semibold text-[#28583f]">
                        {skill.level}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#58866a]"
                        style={{
                          width:
                            skill.level === "Beginner"
                              ? "25%"
                              : skill.level === "Intermediate"
                                ? "50%"
                                : skill.level === "Advanced"
                                  ? "75%"
                                  : "100%",
                        }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}