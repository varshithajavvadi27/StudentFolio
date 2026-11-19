
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const API_URL = "http://localhost:5000";
const getUserId = () => {
  if (typeof window === "undefined") return "";
  const storedUser = localStorage.getItem("studentfolio-user");
  if (!storedUser) return "";
  return String(JSON.parse(storedUser).id ?? "");
};

type Education = {
  id: number;
  degree: string;
  institution: string;
  field: string;
  startYear: number | null;
  endYear: number | null;
  grade: string;
  description: string;
};

const emptyForm = {
  degree: "",
  institution: "",
  field: "",
  startYear: "",
  endYear: "",
  grade: "",
  description: "",
};

export default function EducationPage() {
  const [form, setForm] = useState(emptyForm);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function loadEducation() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/education/${getUserId()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load education.");
      }

      setEducationList(data.education || []);
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
    void loadEducation();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function startEditing(item: Education) {
    setEditingId(item.id);
    setForm({
      degree: item.degree || "",
      institution: item.institution || "",
      field: item.field || "",
      startYear: item.startYear?.toString() || "",
      endYear: item.endYear?.toString() || "",
      grade: item.grade || "",
      description: item.description || "",
    });
    setMessage("");
    setIsError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setIsError(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (!form.degree.trim() || !form.institution.trim()) {
      setIsError(true);
      setMessage("Please enter your degree and institution.");
      return;
    }

    const startYear = form.startYear ? Number(form.startYear) : null;
    const endYear = form.endYear ? Number(form.endYear) : null;

    if (
      startYear !== null &&
      endYear !== null &&
      endYear < startYear
    ) {
      setIsError(true);
      setMessage("End year cannot be earlier than start year.");
      return;
    }

    try {
      setSaving(true);

     const url =
  editingId !== null
    ? `${API_URL}/api/education/${getUserId()}/${editingId}`
    : `${API_URL}/api/education/${getUserId()}`;

const response = await fetch(url, {
        method: editingId !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          degree: form.degree.trim(),
          institution: form.institution.trim(),
          field: form.field.trim(),
          startYear,
          endYear,
          grade: form.grade.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not save education."
        );
      }

      const wasEditing = editingId !== null;

      setForm(emptyForm);
      setEditingId(null);
      setMessage(
        wasEditing
          ? "Education details updated successfully!"
          : "Education details saved successfully!"
      );

      await loadEducation();
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save education."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEducation(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?"
    );

    if (!confirmed) return;

    setMessage("");
    setIsError(false);

    try {
      setDeletingId(id);

      const response = await fetch(
  `${API_URL}/api/education/${getUserId()}/${id}`,
  { method: "DELETE" }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not delete education."
        );
      }

      setEducationList((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      setMessage("Education record deleted successfully.");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not delete education."
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
              Education
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Add your educational qualifications to your portfolio.
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
            {editingId !== null ? "Edit Education" : "Add Education"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Degree / Qualification *
                </label>
                <input
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  placeholder="B.Tech"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  College / Institution *
                </label>
                <input
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="Your college name"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Field of Study</label>
                <input
                  name="field"
                  value={form.field}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Grade / CGPA</label>
                <input
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  placeholder="8.5 CGPA"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Start Year</label>
                <input
                  name="startYear"
                  type="number"
                  min="1950"
                  max="2100"
                  value={form.startYear}
                  onChange={handleChange}
                  placeholder="2024"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Graduation / End Year
                </label>
                <input
                  name="endYear"
                  type="number"
                  min="1950"
                  max="2100"
                  value={form.endYear}
                  onChange={handleChange}
                  placeholder="2028"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add relevant coursework or academic details..."
                className={inputClass}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#183c2c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Save Education"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
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
            Your Education
          </h2>

          {loading ? (
            <p className="mt-5 text-sm text-gray-500">
              Loading education records...
            </p>
          ) : educationList.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="font-medium text-gray-700">
                No education records yet.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Add your first qualification using the form above.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {educationList.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 p-5 sm:flex-row"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.degree}
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      {item.institution}
                    </p>

                    {item.field && (
                      <p className="mt-1 text-sm text-gray-600">
                        {item.field}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-gray-500">
                      {item.startYear ?? "—"} –{" "}
                      {item.endYear ?? "Present"}
                      {item.grade ? ` · ${item.grade}` : ""}
                    </p>

                    {item.description && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-start gap-4">
                    <button
                      type="button"
                      disabled={saving || deletingId !== null}
                      onClick={() => startEditing(item)}
                      className="text-sm font-semibold text-emerald-800 hover:underline disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === item.id || saving}
                      onClick={() => void deleteEducation(item.id)}
                      className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
