import Link from "next/link";

export const metadata = {
  title: "预约确认 - 心青心理教练",
};

export default function BookingConfirmPage() {
  return (
    <div className="container py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold">预约已提交</h1>
      <p className="mt-3 text-foreground/70">我们已收到你的信息，将在24小时内与你确认匹配与时间安排。你也可以添加客服微信以便加速确认。</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-white font-semibold hover:bg-[color:var(--primary-600)]">返回首页</Link>
    </div>
  );
}


