import { BottomNav } from "../components/dashboard/bottom-nav";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-black text-zinc-100">
      {children}
      <BottomNav />
    </div>
  );
}
