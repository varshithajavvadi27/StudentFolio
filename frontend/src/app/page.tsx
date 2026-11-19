
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Build your profile",
    description:
      "Showcase your education, skills, interests, and career goals in one place.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Showcase projects",
    description:
      "Highlight your best work, technologies, GitHub repositories, and achievements.",
    icon: "⌘",
  },
  {
    number: "03",
    title: "Share your portfolio",
    description:
      "Create a professional portfolio you can share with recruiters and companies.",
    icon: "↗",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f8f5] text-[#18251e]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#183c2c] text-xl text-white">
            S
          </span>
          <span className="text-lg font-bold tracking-tight">
            Student<span className="text-[#498363]">Folio</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          <a href="#features" className="hover:text-[#183c2c]">
            Features
          </a>
         <a href="#how-it-works" className="hover:text-[#183c2c]">
  How it works
</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-white sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-[#183c2c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#28583f]"
          >
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 md:pt-20 lg:grid-cols-2 lg:px-10 lg:pb-28">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d8e4d8] bg-white px-4 py-2 text-xs font-semibold text-[#315c43]">
            <span className="h-2 w-2 rounded-full bg-[#6eae7c]" />
            YOUR CAREER JOURNEY STARTS HERE
          </div>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Your talent.
            <br />
            Your story.
            <br />
            <span className="text-[#58866a]">Your portfolio.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            Turn your skills, projects, and achievements into a professional
            student portfolio. Build your story and get ready for your next
            opportunity.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-[#183c2c] px-6 py-4 font-semibold text-white shadow-lg shadow-green-950/10 transition hover:-translate-y-0.5 hover:bg-[#28583f]"
            >
              Create my portfolio <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-gray-200 bg-white px-6 py-4 font-semibold transition hover:border-gray-400"
            >
              Explore features
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-gray-500">
            <span>✓ Easy to customize</span>
            <span>✓ Student friendly</span>
            <span>✓ Shareable profile</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#e3eadb] blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-[#dce9e2] blur-3xl" />

          <div className="relative rounded-[2rem] border border-white bg-white p-4 shadow-2xl shadow-[#203d2b]/10 sm:p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  PORTFOLIO PREVIEW
                </p>
                <p className="mt-1 font-semibold">My professional profile</p>
              </div>
              <span className="rounded-full bg-[#e8f4e9] px-3 py-1.5 text-xs font-semibold text-[#39744c]">
                Preview
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-[#183c2c] p-6 text-white sm:p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d7e7d6] text-2xl font-bold text-[#183c2c]">
                S
              </div>
              <p className="mt-5 text-2xl font-semibold">Student Name</p>
              <p className="mt-2 text-sm text-green-100">
                Aspiring Software Developer
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["React", "Python", "TypeScript"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-green-50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-sm text-gray-500">Projects</p>
                <p className="mt-2 text-2xl font-bold">03</p>
                <p className="mt-1 text-xs text-gray-400">Featured work</p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-sm text-gray-500">Skills</p>
                <p className="mt-2 text-2xl font-bold">08</p>
                <p className="mt-1 text-xs text-gray-400">Core strengths</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5f7f3] p-4">
              <div>
                <p className="text-sm font-semibold">Portfolio ready to share</p>
                <p className="mt-1 text-xs text-gray-500">
                  Your work, all in one place
                </p>
              </div>
              <span className="text-xl text-[#477956]">↗</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#58866a]">
              Everything in one place
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Make your hard work stand out.
            </h2>
            <p className="mt-5 leading-7 text-gray-600">
              Organize your academic journey and present your best work with a
              portfolio that reflects your potential.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-3xl border border-gray-100 bg-[#fafbf8] p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5eee4] text-xl text-[#315c43]">
                    {feature.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-400">
                    {feature.number}
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

    
<section
  id="how-it-works"
  className="mx-auto max-w-7xl scroll-mt-20 px-6 py-20 lg:px-10 lg:py-24"
>
  <div className="text-center">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#58866a]">
      Simple process
    </p>
    <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
      How StudentFolio works
    </h2>
    <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
      Create your account, build your portfolio, and share your achievements
      with the world.
    </p>
  </div>

  <div className="mt-12 grid gap-6 md:grid-cols-3">
    <article className="rounded-3xl border border-gray-200 bg-white p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf0e6] font-bold text-[#183c2c]">
        01
      </div>
      <h3 className="mt-5 text-xl font-semibold">Create your account</h3>
      <p className="mt-3 leading-7 text-gray-600">
        Register with your email and log in securely to access your personal
        dashboard.
      </p>
    </article>

    <article className="rounded-3xl border border-gray-200 bg-white p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf0e6] font-bold text-[#183c2c]">
        02
      </div>
      <h3 className="mt-5 text-xl font-semibold">Build your portfolio</h3>
      <p className="mt-3 leading-7 text-gray-600">
        Add your profile, education, skills, projects, and achievements.
        Your saved information stays associated with your account.
      </p>
    </article>

    <article className="rounded-3xl border border-gray-200 bg-white p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf0e6] font-bold text-[#183c2c]">
        03
      </div>
      <h3 className="mt-5 text-xl font-semibold">Preview and share</h3>
      <p className="mt-3 leading-7 text-gray-600">
        Preview your portfolio and present your work in a professional way.
      </p>
    </article>
  </div>

  <div className="mt-10 text-center">
    <Link
      href="/register"
      className="inline-flex rounded-xl bg-[#183c2c] px-6 py-4 font-semibold text-white transition hover:bg-[#28583f]"
    >
      Get started <span className="ml-2">→</span>
    </Link>
  </div>
</section>
      <footer className="border-t border-gray-200 bg-white px-6 py-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-gray-500 sm:flex-row">
          <p>
            © 2026 StudentFolio. Built for the next generation of professionals.
          </p>
          <p>Learn. Build. Showcase.</p>
        </div>
      </footer>
    </main>
  );
}
