import CoachGrid from "@/components/CoachGrid";

export const metadata = {
  title: "教练团队 - 心青心理教练",
  description: "严选与培养并重，持续督导，专业可靠的心理教练团队。",
};

export default function CoachesPage() {
  return (
    <div className="bg-background">
      <div className="container py-12 md:py-16">
        <h1 className="heading-section text-3xl md:text-4xl">教练团队</h1>
        <p className="mt-3 text-foreground/70">了解我们的资质、擅长主题与陪伴风格。</p>
      </div>
      <div className="bg-card/50 border-t border-border">
        <CoachGrid />
      </div>
    </div>
  );
}


