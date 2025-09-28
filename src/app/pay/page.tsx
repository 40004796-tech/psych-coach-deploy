export const metadata = { title: "预约支付 - 心青心理教练" };

export default function PayPage() {
  return (
    <div className="container py-16 md:py-24">
      <h1 className="heading-section text-3xl md:text-4xl">预约支付</h1>
      <p className="mt-2 text-foreground/70">请选择支付方式，扫码完成支付后我们将优先为你安排匹配。</p>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">微信支付</h2>
          <div className="mt-4 h-56 rounded-xl border border-border flex items-center justify-center bg-gray-50">
            <div className="text-foreground/60 text-center">
              <p>请上传微信收款码到</p>
              <p className="text-sm mt-1">/public/pay/wechat-qr.png</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">支付宝支付</h2>
          <div className="mt-4 h-56 rounded-xl border border-border flex items-center justify-center bg-gray-50">
            <div className="text-foreground/60 text-center">
              <p>请上传支付宝收款码到</p>
              <p className="text-sm mt-1">/public/pay/alipay-qr.png</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-sm text-foreground/70">支付后请保留截图，并在预约确认时发送给客服以便核对。</div>
    </div>
  );
}


