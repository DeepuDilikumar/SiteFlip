import { AppHeader } from "@/components/app/app-header";
import { requireUser } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={user} />
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
