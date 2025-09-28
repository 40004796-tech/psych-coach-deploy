"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthValid, getCurrentUser } from "@/lib/auth";
import { ServicePackage, formatPrice } from "@/lib/services";
import AuthGuard from "./AuthGuard";
import ConfigServicePackageSelector from "./ConfigServicePackageSelector";

export default function BookingCTA() {
  const [step, setStep] = useState<'package' | 'form'>('package');
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    topic: "",
    mode: "",
    preferredTime: "",
    urgency: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const router = useRouter();

  // 检查用户是否已登录
  const isUserLoggedIn = isAuthValid();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePackageSelect = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
  };

  const handleContinueToForm = () => {
    // 如果用户未登录，显示认证守卫
    if (!isUserLoggedIn) {
      setShowAuthGuard(true);
      return;
    }
    
    // 如果已登录，自动填充用户信息
    const currentUser = getCurrentUser();
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        contact: currentUser.phone
      }));
    }
    
    setStep('form');
  };

  const handleBackToPackage = () => {
    setStep('package');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 这里不需要再检查登录状态，因为在进入表单时已经检查过了
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          servicePackage: selectedPackage,
          totalPrice: selectedPackage?.price || 0
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // 清空表单
        setFormData({
          name: "",
          contact: "",
          topic: "",
          mode: "",
          preferredTime: "",
          urgency: "",
          note: ""
        });
        setSelectedPackage(null);
        setStep('package');
        // 3秒后跳转到确认页面
        setTimeout(() => {
          router.push("/booking/confirm");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("提交预约失败:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthGuard(false);
    // 认证成功后自动填充用户信息并进入表单
    const currentUser = getCurrentUser();
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        contact: currentUser.phone
      }));
    }
    setStep('form');
  };

  return (
    <section id="book" className="container py-16 md:py-24 scroll-mt-20">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-accent/20 to-secondary/20 p-8 md:p-12 shadow-sm">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold">准备好开始了吗？</h2>
          <p className="mt-3 text-foreground/80">
            {step === 'package' 
              ? '选择适合您的服务套餐，开启心理成长之旅。'
              : '填写基本信息，我们会在24小时内与你确认匹配与时间。'
            }
          </p>
        </div>
        
        {submitStatus === "success" && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
            ✅ 预约提交成功！正在跳转到确认页面...
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            ❌ 提交失败，请重试或联系客服。
          </div>
        )}

        {step === 'package' ? (
          <div className="mt-8">
            <ConfigServicePackageSelector
              selectedPackage={selectedPackage}
              onSelectPackage={handlePackageSelect}
              onContinue={handleContinueToForm}
              isUserLoggedIn={isUserLoggedIn}
            />
          </div>
        ) : (
          <div className="mt-8">
            {/* 已选择的套餐信息 */}
            {selectedPackage && (
              <div className="mb-6 p-4 bg-white rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPackage?.name || ''}</h3>
                    <p className="text-sm text-gray-600">{selectedPackage?.description || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{formatPrice(selectedPackage?.price || 0)}</p>
                    <button
                      onClick={handleBackToPackage}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      重新选择
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本信息 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">你的称呼 *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    placeholder="请输入你的姓名"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">联系方式 *</label>
                  <input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    placeholder="微信/手机号"
                    required
                  />
                </div>
              </div>

              {/* 咨询偏好 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">关注主题 *</label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    required
                  >
                    <option value="">请选择关注主题</option>
                    <option value="情绪管理">情绪管理</option>
                    <option value="亲密关系">亲密关系</option>
                    <option value="职业发展">职业发展</option>
                    <option value="自我探索">自我探索</option>
                    <option value="焦虑抑郁">焦虑抑郁</option>
                    <option value="人际关系">人际关系</option>
                    <option value="家庭关系">家庭关系</option>
                    <option value="学习压力">学习压力</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">咨询形式 *</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    required
                  >
                    <option value="">请选择咨询形式</option>
                    <option value="线上视频">线上视频</option>
                    <option value="线下见面">线下见面</option>
                    <option value="均可">均可</option>
                  </select>
                </div>
              </div>

              {/* 时间偏好 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">偏好时间</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                  >
                    <option value="">请选择偏好时间</option>
                    <option value="工作日白天">工作日白天</option>
                    <option value="工作日晚上">工作日晚上</option>
                    <option value="周末白天">周末白天</option>
                    <option value="周末晚上">周末晚上</option>
                    <option value="均可">均可</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">紧急程度</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                  >
                    <option value="">请选择紧急程度</option>
                    <option value="一般">一般</option>
                    <option value="较急">较急</option>
                    <option value="很急">很急</option>
                    <option value="紧急">紧急</option>
                  </select>
                </div>
              </div>

              {/* 详细描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full min-h-32 rounded-xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                  placeholder="请简单描述你的现状、困扰或希望达成的目标（选填）"
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBackToPackage}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  重新选择套餐
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:bg-[color:var(--primary-600)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "提交中..." : "提交预约"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 认证守卫 */}
      {showAuthGuard && (
        <AuthGuard onAuthRequired={handleAuthSuccess}>
          <div></div>
        </AuthGuard>
      )}
    </section>
  );
}


