
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Achievement = {
  id: number;
  title: string;
  type: string;
  organization: string;
  date: string | null;
  description: string;
  certificateUrl: string;
};

const emptyForm = {
  title: "",
  type: "Certificate",
  organization: "",
  date: "",
  description: "",
  certificateUrl: "",
};

export default function AchievementsPage() {
  const [form, setForm] = useState(emptyForm);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("studentfolio-user");

    if (!storedUser) {
      setMessage("Please log in to manage your achievements.");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const id = Number(typeof user === "object" ? user.id : user);

      if (!Number.isInteger(id) || id <= 0) {
        setMessage("Invalid user session. Please log in again.");
        setLoading(false);
        return;
      }

      setUserId(id);
    } catch {
      setMessage("Unable to read your login session. Please log in again.");
      setLoading(false);
    }
  }, []);

  const loadAchievements = useCallback(async (id: number) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/achievements/${id}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load achievements.");
      }

      setAchievements(data.achievements || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load achievements. Check the backend server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      void loadAchievements(userId);
    }
  }, [userId, loadAchievements]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (userId === null) {
      setMessage("Please log in first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/achievements/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save achievement.");
      }

      setForm(emptyForm);
      setMessage("Achievement saved to database successfully!");
      await loadAchievements(userId);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save achievement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteAchievement(id: number) {
    if (userId === null) return;

    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/achievements/${userId}/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete achievement.");
      }

      setMessage("Achievement deleted successfully.");
      await loadAchievements(userId);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete achievement."
      );
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
                label === "Achievements"
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
            Celebrate your progress
          </p>
          <h1 className="mt-2 text-3xl font-bold">Achievements</h1>
          <p className="mt-2 text-gray-500">
            Showcase certificates, awards, internships, and hackathon achievements.
          </p>
        </div>

        <div className="mt-8 grid max-w-6xl gap-7 xl:grid-cols-[1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold">Add an achievement</h2>
            <p className="mt-1 text-sm text-gray-500">
              Record your certificates, awards, and accomplishments.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                  Achievement title
                </label>
                <input
                  id="title"
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Python Programming Certificate"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#58866a]"
                />
              </div>

              <div>
                <label htmlFor="type" className="mb-2 block text-sm font-medium">
                  Achievement type
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#58866a]"
                >
                  <option>Certificate</option>
                  <option>Hackathon</option>
                  <option>Award</option>
                  <option>Internship</option>
                  <option>Competition</option>
                  <option>Publication</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="organization"
                  className="mb-2 block text-sm font-medium"
                >
                  Issuing organization
                </label>
                <input
                  id="organization"
                  required
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                  placeholder="e.g. Coursera, college, or company"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#58866a]"
                />
              </div>

              <div>
                <label htmlFor="date" className="mb-2 block text-sm font-medium">
                  Date received
                </label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#58866a]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="What did you learn or accomplish?"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#58866a]"
                />
              </div>

              <div>
                <label
                  htmlFor="certificateUrl"
                  className="mb-2 block text-sm font-medium"
                >
                  Certificate / proof URL (optional)
                </label>
                <input
                  id="certificateUrl"
                  type="url"
                  value={form.certificateUrl}
                  onChange={(e) =>
                    setForm({ ...form, certificateUrl: e.target.value })
                  }
                  placeholder="https://example.com/certificate"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#58866a]"
                />
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
                disabled={saving || userId === null}
                className="w-full rounded-xl bg-[#183c2c] px-5 py-3.5 font-semibold text-white hover:bg-[#28583f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add achievement →"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Your achievements</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Accomplishments added to your portfolio.
                </p>
              </div>
              <span className="rounded-full bg-[#eaf1e7] px-3 py-1 text-sm font-semibold text-[#28583f]">
                {achievements.length}
              </span>
            </div>

            {loading ? (
              <p className="mt-6 text-sm text-gray-500">
                Loading achievements...
              </p>
            ) : achievements.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                <span className="text-3xl">✧</span>
                <p className="mt-3 font-semibold">No achievements yet</p>
                <p className="mt-2 text-sm text-gray-500">
                  Add your first achievement using the form.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {achievements.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-[#eaf1e7] px-3 py-1 text-xs font-semibold text-[#28583f]">
                          {item.type}
                        </span>
                        <h3 className="mt-3 font-bold">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.organization}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void deleteAchievement(item.id)}
                        className="shrink-0 text-sm font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>

                    {item.date && (
                      <p className="mt-3 text-xs text-gray-400">
                        Received: {item.date.slice(0, 10)}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-3 text-sm leading-6 text-gray-500">
                        {item.description}
                      </p>
                    )}
                    {item.certificateUrl && (
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm font-semibold text-[#28583f] hover:underline"
                      >
                        View proof ↗
                      </a>
                    )}
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
