"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      Çıkış
    </button>
  );
}
