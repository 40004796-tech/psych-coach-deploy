type Testimonial = {
  name: string;
  role: string;
  content: string;
};

const list: Testimonial[] = [
  {
    name: "Y.同学",
    role: "大学生",
    content:
      "每次结束都更有力量，开始愿意表达真实的需要，也更理解自己了。",
  },
  {
    name: "L.同事",
    role: "设计师",
    content: "焦虑明显减少，能把注意力放回当下，逐步建立稳定节奏。",
  },
  {
    name: "C.朋友",
    role: "产品经理",
    content: "在职业困惑期得到很大支持，行动计划也更清晰可行。",
  },
];

export default function Testimonials() {
  return (
    <section className="container py-16 md:py-24">
      <h2 className="heading-section text-3xl md:text-4xl text-center">他们这样说</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {list.map((t) => (
          <blockquote key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-foreground/80">“{t.content}”</p>
            <footer className="mt-4 text-sm text-foreground/60">— {t.name} · {t.role}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}


