type Coach = {
  name: string;
  title: string;
  tags: string[];
  bio: string;
};

const coaches: Coach[] = [
  {
    name: "林晨",
    title: "国家二级心理咨询师 / 青年成长教练",
    tags: ["情绪管理", "自我探索", "关系沟通"],
    bio: "温暖稳重的陪伴风格，擅长帮助来访者建立自我支持。",
  },
  {
    name: "苏宁",
    title: "职业发展教练 / ICF ACC",
    tags: ["职业规划", "目标达成", "压力管理"],
    bio: "以目标为导向，兼顾情绪与行动，助你稳步成长。",
  },
  {
    name: "张一",
    title: "亲密关系教练 / 婚恋沟通",
    tags: ["亲密关系", "沟通技巧", "自我价值"],
    bio: "关注关系中的真实需要，促进更清晰的表达与理解。",
  },
];

export default function CoachGrid() {
  return (
    <section id="coaches" className="container py-16 md:py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="heading-section text-3xl md:text-4xl">我们的教练</h2>
          <p className="mt-2 text-foreground/70">严选与培养并重，持续督导，专业可靠。</p>
        </div>
        <a href="#book" className="hidden md:inline-flex rounded-full bg-primary px-5 py-2.5 text-white font-semibold hover:bg-[color:var(--primary-600)] focus:ring-4 focus:ring-primary/30">预约匹配</a>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {coaches.map((c) => (
          <article key={c.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {c.name.slice(0, 1)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{c.name}</h3>
                <p className="text-sm text-foreground/70">{c.title}</p>
              </div>
            </div>
            <p className="mt-4 text-foreground/80 leading-relaxed">{c.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span key={t} className="inline-flex rounded-full bg-muted/60 px-2.5 py-1 text-xs text-foreground/80">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


