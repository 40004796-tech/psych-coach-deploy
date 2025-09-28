import Link from "next/link";

export const metadata = {
  title: "服务与价格 - 心青心理教练",
  description: "个体教练、关系沟通、职业发展等主题的服务说明与参考价格。",
};

export default function ServicesPage() {
  const plans = [
    { name: "体验单次", price: "¥299", desc: "首次体验，评估与目标梳理（约50分钟）" },
    { name: "标准单次", price: "¥499", desc: "常规单次会谈（约50分钟）" },
    { name: "4次成长包", price: "¥1799", desc: "阶段性主题聚焦，建议4-6周内完成" },
  ];
  return (
    <div className="container py-16 md:py-24">
      <h1 className="heading-section text-3xl md:text-4xl">服务与价格</h1>
      <p className="mt-3 text-foreground/70">支持线上视频或线下空间，隐私安全，灵活预约。</p>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <div className="mt-2 text-3xl font-bold text-primary">{p.price}</div>
            <p className="mt-2 text-foreground/70">{p.desc}</p>
            <Link href="/#book" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-white font-semibold hover:bg-[color:var(--primary-600)]">预约</Link>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/20 p-6">
        <h3 className="text-lg font-semibold">主题示例</h3>
        <ul className="mt-3 grid md:grid-cols-2 gap-2 text-foreground/80">
          {["情绪压力与焦虑","亲密与沟通","自我探索与自信","职业发展与选择","边界与自我照顾","拖延与动力"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />{t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


