
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage("Registration successful! You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5] px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-[#183c2c] p-10 text-white md:flex">
          <Link href="/" className="text-xl font-bold">
            Student<span className="text-green-300">Folio</span>
          </Link>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-200">
              Start your journey
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight">
              Your next chapter starts with your story.
            </h1>
            <p className="mt-5 leading-7 text-green-100">
              Bring your education, skills, projects, and achievements
              together in one professional portfolio.
            </p>
          </div>

          <p className="text-sm text-green-200">
            Learn. Build. Showcase.
          </p>
        </section>

        <section className="p-7 sm:p-10">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-[#183c2c]"
          >
            ← Back to home
          </Link>

          <h2 className="mt-8 text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Register to start building your student portfolio.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#58866a] focus:ring-2 focus:ring-[#58866a]/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#58866a] focus:ring-2 focus:ring-[#58866a]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#58866a] focus:ring-2 focus:ring-[#58866a]/20"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#58866a] focus:ring-2 focus:ring-[#58866a]/20"
              />
            </div>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className="rounded-xl bg-[#f0f5ee] p-3 text-sm text-[#28583f]"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#183c2c] px-5 py-3.5 font-semibold text-white transition hover:bg-[#28583f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#28583f] hover:underline"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
