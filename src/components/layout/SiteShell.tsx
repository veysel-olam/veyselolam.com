import { Dock } from "./Dock";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Dock />
    </div>
  );
}
