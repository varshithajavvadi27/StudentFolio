
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed. Check your details.");
        return;
      }

      if (!data.user?.id) {
        setMessage("Login response is missing user details. Please try again.");
        return;
      }

      // Save the logged-in user's details for the dashboard and profile page.
      localStorage.setItem(
  "studentfolio-user",
  JSON.stringify(data.user)
);

localStorage.setItem("studentfolio-token", data.token);

      setSuccess(true);
      setMessage(`Welcome, ${data.user.name}! Login successful.`);

      // Redirect after a brief moment so the success message is visible.
      window.setTimeout(() => {
        window.location.href = "/dashboard/profile";
      }, 700);
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
              Welcome back
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight">
              Your journey continues here.
            </h1>
            <p className="mt-5 leading-7 text-green-100">
              Sign in to continue building your profile, showcasing your
              projects, and sharing your achievements.
            </p>
          </div>

          <p className="text-sm text-green-200">Learn. Build. Showcase.</p>
        </section>

        <section className="p-7 sm:p-10">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-[#183c2c]"
          >
            ← Back to home
          </Link>

          <h2 className="mt-10 text-3xl font-bold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Enter your account details to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#58866a] focus:ring-2 focus:ring-[#58866a]/20"
              />
            </div>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-xl p-3 text-sm ${
                  success
                    ? "bg-[#edf5eb] text-[#28583f]"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#183c2c] px-5 py-3.5 font-semibold text-white transition hover:bg-[#28583f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Log in →"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#28583f] hover:underline"
            >
              Create account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
