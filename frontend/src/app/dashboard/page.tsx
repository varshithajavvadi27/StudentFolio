
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  detail: string;
  done: boolean;
};

const initialTasks: Task[] = [
  { id: 1, title: "Complete your profile", detail: "Add your bio and contact details", done: false },
  { id: 2, title: "Add your education", detail: "Showcase your academic journey", done: false },
  { id: 3, title: "Add your first project", detail: "Highlight a project you have built", done: false },
  { id: 4, title: "List your skills", detail: "Help recruiters discover your strengths", done: false },
];

const navItems = [
  { icon: "⌂", label: "Overview", href: "/dashboard" },
  { icon: "♙", label: "My Profile", href: "/dashboard/profile" },
  { icon: "▤", label: "Education", href: "/dashboard/education" },
  { icon: "⌘", label: "Projects", href: "/dashboard/projects" },
  { icon: "✧", label: "Skills", href: "/dashboard/skills" },
  { icon: "☆", label: "Achievements", href: "/dashboard/achievements" },
];

export default function DashboardPage() {
    const handleLogout = () => {
    localStorage.removeItem("studentfolio-user");
    window.location.href = "/login";
  };
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const storedUser = localStorage.getItem("studentfolio-user");

        if (!storedUser) {
          setLoadingProgress(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id;

        if (!userId) {
          setLoadingProgress(false);
          return;
        }

        const endpoints = [
          `http://localhost:5000/api/profile/${userId}`,
          `http://localhost:5000/api/education/${userId}`,
          `http://localhost:5000/api/projects/${userId}`,
          `http://localhost:5000/api/skills/${userId}`,
        ];

        const token = localStorage.getItem("studentfolio-token");

const responses = await Promise.all(
  endpoints.map((url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )
);

        const data = await Promise.all(
          responses.map(async (response) => {
            if (!response.ok) return null;
            return response.json();
          })
        );        
        console.log("Dashboard API data:", data);
const profile = data[0]?.profile;
const education = Array.isArray(data[1]?.education)
  ? data[1].education
  : Array.isArray(data[1])
    ? data[1]
    : [];
const projects = Array.isArray(data[2]?.projects)
  ? data[2].projects
  : Array.isArray(data[2])
    ? data[2]
    : [];
const skills = Array.isArray(data[3]?.skills)
  ? data[3].skills
  : Array.isArray(data[3])
    ? data[3]
    : [];


        setTasks([
          {
            id: 1,
            title: "Complete your profile",
            detail: "Add your bio and contact details",
          done: Boolean(
  profile?.fullName?.trim() &&
  profile?.headline?.trim() &&
  profile?.about?.trim() &&
  profile?.contactEmail?.trim()
),
          },
          {
            id: 2,
            title: "Add your education",
            detail: "Showcase your academic journey",
            done: education.length > 0,
          },
          {
            id: 3,
            title: "Add your first project",
            detail: "Highlight a project you have built",
            done: projects.length > 0,
          },
          {
            id: 4,
            title: "List your skills",
            detail: "Help recruiters discover your strengths",
            done: skills.length > 0,
          },
        ]);
      } catch (error) {
        console.error("Unable to load dashboard progress:", error);
      } finally {
        setLoadingProgress(false);
      }
    }

    loadProgress();
  }, []);

  const completed = tasks.filter((task) => task.done).length;
  const progress = Math.round((completed / tasks.length) * 100);

  return (
    <main className="min-h-screen bg-[#f6f7f3] text-[#1b3025] md:flex">
      <aside className="flex w-full flex-col bg-[#183c2c] p-5 text-white md:min-h-screen md:w-64 md:shrink-0 md:p-6">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg text-[#183c2c]">S</span>
          Student<span className="-ml-3 text-green-300">Folio</span>
        </Link>

        <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-green-200">
          Workspace
        </p>

        <nav className="flex flex-wrap gap-2 md:flex-col">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                index === 0
                  ? "bg-white/15 font-semibold text-white"
                  : "text-green-100 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
       <button
  onClick={handleLogout}
  className="mt-4 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-green-100 transition hover:bg-white/10"
>
  ↪ Logout
</button>
        <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4 md:mt-auto">
          <p className="font-semibold">Your next opportunity</p>
          <p className="mt-2 text-sm leading-6 text-green-100">
            Keep your portfolio updated to present your best work.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-green-200 hover:underline">
            View homepage →
          </Link>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Workspace / Overview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-500">
              Build your story, one step at a time.
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="rounded-xl bg-[#183c2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28583f]"
          >
            Edit my profile ↗
          </Link>
        </header>
        
<div className="mt-6 flex flex-wrap gap-3">
  <Link
    href="/portfolio"
    className="rounded-xl bg-[#183c2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28583f]"
  >
    View My Portfolio ↗
  </Link>

</div>


        <div className="mt-8 rounded-3xl bg-[#183c2c] p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-green-200">WELCOME TO STUDENTFOLIO</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Let&apos;s build your portfolio.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-green-100">
                Add your education, projects, and skills to create a portfolio
                you can share with recruiters.
              </p>
            </div>
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-2xl font-bold">
              {loadingProgress ? "..." : `${progress}%`}
            </div>
          </div>

          <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[#b6e2a1] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-green-100">
            {loadingProgress
              ? "Loading your progress..."
              : `${completed} of ${tasks.length} setup steps completed`}
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Profile",
              value: tasks[0].done ? "Completed" : "Getting started",
              icon: "♙",
            },
            {
              label: "Projects",
              value: tasks[2].done ? "Work added" : "Add your work",
              icon: "⌘",
            },
            {
              label: "Skills",
              value: tasks[3].done ? "Skills listed" : "Show your strengths",
              icon: "✧",
            },
            {
              label: "Portfolio",
              value: completed === tasks.length ? "Ready to share" : "In progress",
              icon: "↗",
            },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1e7] text-xl text-[#315c43]">
                {card.icon}
              </div>
              <p className="mt-4 text-sm text-gray-500">{card.label}</p>
              <p className="mt-1 font-semibold">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Get started</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Complete these steps to build your portfolio.
                </p>
              </div>
              <span className="rounded-full bg-[#eaf1e7] px-3 py-1 text-sm font-semibold text-[#315c43]">
                {completed}/{tasks.length}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={
                    task.id === 1
                      ? "/dashboard/profile"
                      : task.id === 2
                      ? "/dashboard/education"
                      : task.id === 3
                      ? "/dashboard/projects"
                      : "/dashboard/skills"
                  }
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    readOnly
                    aria-label={task.title}
                    className="pointer-events-none mt-1 h-4 w-4 accent-[#28583f]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className={`block font-semibold ${task.done ? "text-gray-400 line-through" : ""}`}>
                      {task.title}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">{task.detail}</span>
                  </span>
                  <span className="text-gray-400">→</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-bold">Portfolio tips</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              A few simple ways to make your profile stand out.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e7]">1</span>
                <div>
                  <p className="font-semibold">Use a clear introduction</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">Explain what you study and what you want to build.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e7]">2</span>
                <div>
                  <p className="font-semibold">Show real projects</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">Add project details, technologies, and repository links.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf1e7]">3</span>
                <div>
                  <p className="font-semibold">Keep it updated</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">Add new skills and achievements as you learn.</p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/profile"
              className="mt-7 block rounded-xl border border-[#dce5da] px-4 py-3 text-center text-sm font-semibold text-[#28583f] transition hover:bg-[#f4f7f1]"
            >
              Start with your profile →
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
