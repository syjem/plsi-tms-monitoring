"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { CurrentUserAvatar } from "@/components/current-user-avatar";

export function Header({
  userData,
}: {
  userData: {
    userName: string;
    userEmail: string | null;
    avatarUrl: string | null;
  };
}) {
  const { userName, userEmail, avatarUrl } = userData;
  const router = useRouter();

  const handleSignout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-3 px-4 rounded-md border-b">
        <div className="flex items-center gap-2">
          <AppLogo />
          <span className="font-medium">Phillogix Systems Inc.</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <CurrentUserAvatar userName={userName} avatarUrl={avatarUrl} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <span>{userName}</span>
                <address className="text-muted-foreground">{userEmail}</address>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignout}
              className="font-semibold hover:bg-red-100"
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
