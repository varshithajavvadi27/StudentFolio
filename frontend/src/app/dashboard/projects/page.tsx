"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const API_URL = "http://localhost:5000";
type Project = {
  id: number;
  title: string;
  description: string;
  technologies: string;
  github: string;
  demo: string;
};

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  github: "",
  demo: "",
};

export default function ProjectsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  useEffect(() => {
  const savedUser = localStorage.getItem("studentfolio-user");

  if (savedUser) {
    const user = JSON.parse(savedUser);
    setUserId(Number(user.id));
  }
}, []);
  async function loadProjects() {
    try {
      setLoading(true);

      const token = localStorage.getItem("studentfolio-token");

const response = await fetch(
  `${API_URL}/api/projects/${userId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load projects.");
      }

      setProjects(data.projects || []);
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  if (userId !== null) {
    void loadProjects();
  }
}, [userId]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (!form.title.trim()) {
      setIsError(true);
      setMessage("Please enter your project title.");
      return;
    }

    try {
      setSaving(true);

     const response = await fetch(
  `${API_URL}/api/projects/${userId}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("studentfolio-token")}`,
    },
    body: JSON.stringify({
      title: form.title.trim(),
      description: form.description.trim(),
      technologies: form.technologies.trim(),
      github: form.github.trim(),
      demo: form.demo.trim(),
    }),
  }
);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save project.");
      }

      setForm(emptyForm);
      setMessage("Project saved successfully!");
      await loadProjects();
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: number) {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setMessage("");
    setIsError(false);

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/api/projects/${userId}/${id}`,
        {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("studentfolio-token")}`,
  },
}
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete project.");
      }

      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      );
      setMessage("Project deleted successfully!");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not delete project."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-800">
              StudentFolio Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Projects
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Showcase the projects you have built.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Project
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className={labelClass}>Project Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Student Management System"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Explain what your project does..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Technologies Used
              </label>
              <input
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL"
                className={inputClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input
                  name="github"
                  type="url"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username/project"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Live Demo URL</label>
                <input
                  name="demo"
                  type="url"
                  value={form.demo}
                  onChange={handleChange}
                  placeholder="https://your-project.com"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#183c2c] px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
          </form>

          {message && (
            <p
              role="status"
              className={`mt-5 rounded-lg p-3 text-sm ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {message}
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Projects
          </h2>

          {loading ? (
            <p className="mt-5 text-sm text-gray-500">
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="font-medium text-gray-700">
                No projects added yet.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Add your first project using the form above.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && (
                    <p className="mt-3 text-sm text-gray-700">
                      <span className="font-semibold">Technologies:</span>{" "}
                      {project.technologies}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-800 hover:underline"
                      >
                        GitHub ↗
                      </a>
                    )}

                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-800 hover:underline"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={deletingId === project.id}
                    onClick={() => void deleteProject(project.id)}
                    className="mt-5 text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === project.id
                      ? "Deleting..."
                      : "Delete Project"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}