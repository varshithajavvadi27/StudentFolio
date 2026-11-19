
  useEffect(() => { void loadPortfolio(); }, [loadPortfolio]);
  useEffect(() => {
    const saved = window.localStorage.getItem("studentfolio-template");
    if (saved === "minimal" || saved === "dark-tech" || saved === "creative" || saved === "professional") setTemplateId(saved);
  }, []);
  const chooseTemplate = (id: TemplateId) => { setTemplateId(id); window.localStorage.setItem("studentfolio-template", id); };

  const dark = templateId === "dark-tech";
  const creative = templateId === "creative";
  const professional = templateId === "professional";
  const page = dark ? "min-h-screen bg-[#080d18] text-slate-100" : creative ? "min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 text-slate-800" : professional ? "min-h-screen bg-slate-100 text-slate-800" : "min-h-screen bg-[#f4f7f3] text-[#20372b]";
  const card = dark ? "rounded-2xl border border-slate-700 bg-[#111a2b] shadow-lg shadow-black/10" : creative ? "rounded-3xl border border-white bg-white/90 shadow-xl shadow-violet-100/70" : professional ? "rounded-xl border border-slate-200 bg-white shadow-sm" : "rounded-2xl border border-emerald-100 bg-white shadow-sm";
  const muted = dark ? "text-slate-300" : "text-slate-600";
  const accent = dark ? "text-cyan-300" : creative ? "text-violet-700" : professional ? "text-blue-800" : "text-emerald-800";
  const heading = `text-xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`;
  const chip = dark ? "bg-slate-800 text-slate-200" : creative ? "bg-violet-100 text-violet-900" : professional ? "bg-blue-50 text-blue-900" : "bg-emerald-50 text-emerald-900";

  return (
    <main className={page}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${dark ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"}`}>← Back to dashboard</Link>
          <button onClick={() => void loadPortfolio()} className={`rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${dark ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200" : creative ? "bg-violet-700 text-white hover:bg-violet-800" : professional ? "bg-blue-800 text-white hover:bg-blue-900" : "bg-emerald-800 text-white hover:bg-emerald-900"}`}>↻ Refresh portfolio</button>
        </div>

        <header className="mb-7">
          <p className={`mb-2 text-xs font-bold uppercase tracking-[0.25em] ${accent}`}>StudentFolio · Portfolio Studio</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Your portfolio, your style.</h1><p className={`mt-2 text-sm sm:text-base ${muted}`}>Choose a layout to preview your saved details in a different design.</p></div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${chip}`}>Preview mode</span>
          </div>
        </header>

        <section aria-label="Choose portfolio template" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((item, index) => {
            const active = templateId === item.id;
            const swatch = index === 0 ? "bg-emerald-100 text-emerald-800" : index === 1 ? "bg-slate-800 text-cyan-300" : index === 2 ? "bg-violet-100 text-violet-800" : "bg-blue-100 text-blue-800";
            return <button key={item.id} type="button" aria-pressed={active} onClick={() => chooseTemplate(item.id)} className={`rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${active ? dark ? "border-cyan-300 bg-cyan-300/10 ring-2 ring-cyan-300/30" : creative ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200" : professional ? "border-blue-700 bg-blue-50 ring-2 ring-blue-100" : "border-emerald-700 bg-emerald-50 ring-2 ring-emerald-100" : dark ? "border-slate-700 bg-slate-900/70" : "border-slate-200 bg-white"}`}>
              <div className="mb-3 flex items-center justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded-xl font-black ${swatch}`}>{item.name.charAt(0)}</span>{active && <span className={`text-xs font-bold ${accent}`}>✓ Selected</span>}</div>
              <span className="block font-bold">{item.name}</span><span className={`mt-1 block text-sm ${muted}`}>{item.description}</span>
            </button>;
          })}
        </section>

        {message && <div role="alert" className={`mb-6 rounded-xl border px-4 py-3 text-sm ${dark ? "border-rose-900 bg-rose-950/50 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{message}</div>}
        {loading ? <div className={`${card} flex min-h-64 items-center justify-center p-8`}><div className="text-center"><div className={`mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent ${accent}`} /><p className="font-semibold">Loading your portfolio...</p><p className={`mt-1 text-sm ${muted}`}>Getting your saved details</p></div></div> : <>
          <section id="about" className={`relative mb-7 overflow-hidden ${creative ? "rounded-[2rem] bg-gradient-to-r from-violet-700 via-fuchsia-600 to-orange-400 text-white shadow-xl" : card}`}>
            {creative && <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[30px] border-white/15" />}
            {dark && <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />}
            <div className={`relative grid gap-7 p-6 sm:p-8 ${professional ? "md:grid-cols-[190px_1fr] md:items-center" : "md:grid-cols-[1fr_auto] md:items-center"}`}>
              <div className={`flex items-center gap-5 ${professional ? "md:order-2" : "md:order-1"}`}>
                <div className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl text-3xl font-black shadow-lg sm:h-28 sm:w-28 ${creative ? "border-4 border-white/70 bg-white/20 text-white" : dark ? "border border-cyan-300/30 bg-slate-900 text-cyan-200" : professional ? "rounded-xl bg-blue-100 text-blue-900" : "bg-emerald-100 text-emerald-900"}`}>
                  {profile.photoUrl ? <img src={profile.photoUrl} alt={`${profile.name} profile`} className="h-full w-full object-cover" /> : (profile.name || "S").trim().charAt(0).toUpperCase()}
                </div>
                <div><p className={`mb-2 text-xs font-bold uppercase tracking-[0.2em] ${creative ? "text-white/80" : accent}`}>Hello, I&apos;m</p><h2 className="text-3xl font-black leading-tight sm:text-4xl">{profile.name || "Student Name"}</h2><p className={`mt-2 text-base font-semibold sm:text-lg ${creative ? "text-white" : muted}`}>{profile.headline || "Aspiring Software Developer"}</p></div>
              </div>
              <div className={`max-w-2xl ${professional ? "md:order-1" : "md:order-2 md:text-right"}`}>
                <p className={`mb-4 text-sm leading-7 sm:text-base ${creative ? "text-white/90" : muted}`}>{profile.about || "Add an introduction from your dashboard to tell visitors about yourself."}</p>
                <div className={`flex flex-wrap gap-2 text-xs font-semibold ${professional ? "" : "md:justify-end"}`}>
                  {profile.city && <span className={`rounded-full px-3 py-2 ${creative ? "bg-white/20" : chip}`}>📍 {profile.city}</span>}
                  {profile.course && <span className={`rounded-full px-3 py-2 ${creative ? "bg-white/20" : chip}`}>🎓 {profile.course}</span>}
                  {profile.college && <span className={`rounded-full px-3 py-2 ${creative ? "bg-white/20" : chip}`}>🏫 {profile.college}</span>}
                </div>
              </div>
            </div>
          </section>

          <nav aria-label="Portfolio sections" className={`mb-7 flex flex-wrap gap-2 rounded-2xl p-3 ${dark ? "border border-slate-800 bg-slate-900/70" : "border border-slate-200/70 bg-white/80"}`}>
            {[["Education", "#education"], ["Skills", "#skills"], ["Projects", "#projects"], ["Achievements", "#achievements"], ["Contact", "#contact"]].map(([label, href]) => <a key={href} href={href} className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${dark ? "text-slate-300 hover:bg-slate-800 hover:text-cyan-200" : creative ? "text-violet-800 hover:bg-violet-100" : professional ? "text-blue-900 hover:bg-blue-50" : "text-emerald-900 hover:bg-emerald-50"}`}>{label} ↘</a>)}
          </nav>

          <div className={`grid gap-6 ${professional ? "lg:grid-cols-[0.85fr_1.15fr]" : "lg:grid-cols-2"}`}>
            <section id="education" className={`${card} p-6 sm:p-7`}>
              <SectionHeader emoji="🎓" title="Education" subtitle="My learning journey" heading={heading} muted={muted} chip={chip} />
              {education.length ? <div className="space-y-4">{education.map((item) => <article key={item.id} className={`rounded-xl border-l-4 p-4 ${dark ? "border-cyan-300 bg-slate-900/70" : creative ? "border-violet-500 bg-violet-50/70" : professional ? "border-blue-800 bg-slate-50" : "border-emerald-600 bg-emerald-50/60"}`}><h4 className="font-bold">{item.degree || item.field || "Education"}</h4><p className={`mt-1 text-sm ${muted}`}>{item.institution}</p><p className={`mt-2 text-xs font-semibold ${accent}`}>{item.startYear || "—"} – {item.endYear || "Present"}</p></article>)}</div> : <Empty muted={muted} dark={dark}>No education details added yet.</Empty>}
            </section>

            <section id="skills" className={`${card} p-6 sm:p-7`}>
              <SectionHeader emoji="⚡" title="Skills" subtitle="Tools I work with" heading={heading} muted={muted} chip={chip} />
              {skills.length ? <div className="space-y-5">{Object.entries(skills.reduce<Record<string, Skill[]>>((groups, skill) => { const category = skill.category || "Other"; (groups[category] ||= []).push(skill); return groups; }, {})).map(([category, items]) => <div key={category}><p className={`mb-2 text-xs font-bold uppercase tracking-wider ${muted}`}>{category}</p><div className="flex flex-wrap gap-2">{items.map((skill) => <span key={skill.id} title={skill.level ? `Level: ${skill.level}` : skill.name} className={`rounded-lg border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${dark ? "border-cyan-900 bg-slate-900 text-cyan-100 hover:border-cyan-400" : creative ? "border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100" : professional ? "border-blue-100 bg-blue-50 text-blue-900 hover:border-blue-300" : "border-emerald-100 bg-emerald-50 text-emerald-900 hover:border-emerald-300"}`}>{skill.name}{skill.level && <span className={`ml-2 text-xs font-normal ${muted}`}>· {skill.level}</span>}</span>)}</div></div>)}</div> : <Empty muted={muted} dark={dark}>No skills added yet.</Empty>}
            </section>

            <section id="projects" className={`${card} p-6 sm:p-7 ${professional ? "lg:col-span-2" : ""}`}>
              <SectionHeader emoji="🚀" title="Featured Projects" subtitle="Things I have built" heading={heading} muted={muted} chip={chip} />
              {projects.length ? <div className="grid gap-4 md:grid-cols-2">{projects.map((project, index) => <article key={project.id} className={`group flex h-full flex-col rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${dark ? "border-slate-700 bg-slate-900/70 hover:border-cyan-700" : creative ? "border-violet-100 bg-gradient-to-br from-white to-violet-50 hover:border-violet-300" : professional ? "border-slate-200 bg-slate-50 hover:border-blue-300" : "border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 hover:border-emerald-300"}`}>
                <div className="mb-4 flex items-start justify-between gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl font-black ${chip}`}>{String(index + 1).padStart(2, "0")}</span><span className={`text-xs font-semibold ${muted}`}>PROJECT</span></div><h4 className="text-lg font-bold">{project.title}</h4><p className={`mt-2 flex-1 text-sm leading-6 ${muted}`}>{project.description || "A project built to practise and apply my skills."}</p>
                {project.technologies && <div className="mt-4 flex flex-wrap gap-2">{project.technologies.split(",").map((technology) => technology.trim()).filter(Boolean).map((technology) => <span key={technology} className={`rounded-md px-2 py-1 text-xs font-medium ${dark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>{technology}</span>)}</div>}
                <div className="mt-5 flex flex-wrap gap-3 border-t border-current/10 pt-4 text-sm font-bold">{project.githubUrl && <a className={`${accent} hover:underline`} href={safeUrl(project.githubUrl)} target="_blank" rel="noreferrer">GitHub ↗</a>}{project.liveUrl && <a className={`${accent} hover:underline`} href={safeUrl(project.liveUrl)} target="_blank" rel="noreferrer">Live demo ↗</a>}{!project.githubUrl && !project.liveUrl && <span className={muted}>Links not provided</span>}</div>
              </article>)}</div> : <Empty muted={muted} dark={dark}>No projects added yet.</Empty>}
            </section>

            <section id="achievements" className={`${card} p-6 sm:p-7`}>
              <SectionHeader emoji="🏆" title="Achievements" subtitle="Milestones and certificates" heading={heading} muted={muted} chip={chip} />
              {achievements.length ? <div className="space-y-3">{achievements.map((item) => <article key={item.id} className={`rounded-xl border p-4 ${dark ? "border-slate-700 bg-slate-900/60" : creative ? "border-amber-100 bg-amber-50/60" : professional ? "border-slate-200 bg-slate-50" : "border-emerald-100 bg-emerald-50/50"}`}><div className="flex flex-wrap items-start justify-between gap-2"><h4 className="font-bold">{item.title}</h4>{item.type && <span className={`rounded-full px-2 py-1 text-xs font-semibold ${chip}`}>{item.type}</span>}</div>{item.organization && <p className={`mt-1 text-sm ${muted}`}>{item.organization}</p>}{item.date && <p className={`mt-2 text-xs ${muted}`}>{new Date(item.date).toLocaleDateString()}</p>}{item.description && <p className={`mt-2 text-sm leading-6 ${muted}`}>{item.description}</p>}{item.certificateUrl && <a href={safeUrl(item.certificateUrl)} target="_blank" rel="noreferrer" className={`mt-3 inline-block text-sm font-bold ${accent} hover:underline`}>View certificate ↗</a>}</article>)}</div> : <Empty muted={muted} dark={dark}>No achievements added yet.</Empty>}
            </section>

            <section id="contact" className={`${card} p-6 sm:p-7`}>
              <SectionHeader emoji="✉️" title="Let’s connect" subtitle="Find me around the web" heading={heading} muted={muted} chip={chip} />
              <div className="space-y-3">{profile.github ? <a href={safeUrl(profile.github)} target="_blank" rel="noreferrer" className={`flex items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:-translate-y-0.5 ${dark ? "border-slate-700 hover:border-cyan-400" : "border-slate-200 hover:border-emerald-400"}`}><span>GitHub</span><span className={accent}>Open profile ↗</span></a> : <Empty muted={muted} dark={dark}>Add your GitHub link from the dashboard.</Empty>}{profile.linkedin ? <a href={safeUrl(profile.linkedin)} target="_blank" rel="noreferrer" className={`flex items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:-translate-y-0.5 ${dark ? "border-slate-700 hover:border-cyan-400" : "border-slate-200 hover:border-emerald-400"}`}><span>LinkedIn</span><span className={accent}>Open profile ↗</span></a> : <Empty muted={muted} dark={dark}>Add your LinkedIn link from the dashboard.</Empty>}</div>
              <Link href="/dashboard" className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${accent} hover:underline`}>Edit portfolio details →</Link>
            </section>
          </div>
          <footer className={`mt-8 border-t py-6 text-center text-xs ${dark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"}`}>Built with StudentFolio · Designed to showcase your journey</footer>
        </>}
      </div>
    </main>
  );
}

function SectionHeader({ emoji, title, subtitle, heading, muted, chip }: { emoji: string; title: string; subtitle: string; heading: string; muted: string; chip: string }) {
  return <div className="mb-5 flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${chip}`}>{emoji}</span><div><h3 className={heading}>{title}</h3><p className={`mt-1 text-sm ${muted}`}>{subtitle}</p></div></div>;
}
function Empty({ children, muted, dark }: { children: ReactNode; muted: string; dark: boolean }) {
  return <p className={`rounded-xl border border-dashed p-4 text-sm ${muted} ${dark ? "border-slate-700" : "border-slate-300"}`}>{children}</p>;
}