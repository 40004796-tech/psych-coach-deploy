"use client";
import { useState } from "react";

const faqs = [
  {
    q: "一次多长时间？",
    a: "单次约50分钟，首次会根据你的目标进行评估和计划制定。",
  },
  {
    q: "线上还是线下？",
    a: "均可。我们提供视频与线下空间，视你的方便选择。",
  },
  { q: "价格如何？", a: "根据教练资历与服务形式，区间为¥299-¥899/次。" },
  {
    q: "隐私如何保障？",
    a: "遵循严格保密原则，除法律要求或安全风险外，不会泄露任何信息。",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="container py-16 md:py-24">
      <h2 className="heading-section text-3xl md:text-4xl text-center">常见问题</h2>
      <div className="mt-8 mx-auto max-w-3xl divide-y divide-[color:var(--border)] rounded-2xl border border-border bg-card shadow-sm">
        {faqs.map((item, idx) => (
          <div key={item.q} className="p-5">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              <span className="text-lg font-semibold">{item.q}</span>
              <span className="ml-4 text-foreground/60">{openIdx === idx ? "—" : "+"}</span>
            </button>
            {openIdx === idx && (
              <p className="mt-2 text-foreground/80">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}


