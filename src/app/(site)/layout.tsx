import { Dock } from "@/components/layout/Dock";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Dock />
    </div>
  );
}
