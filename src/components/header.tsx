"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/icons";
import { Loader, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header({
  userData,
}: {
  userData: {
    userName: string;
    userEmail: string;
    avatarUrl: string | undefined;
  };
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { userName, userEmail, avatarUrl } = userData;

  const initials = userName
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  const handleSignout = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-3 px-4 rounded border-b">
        <div className="flex items-center gap-2">
          <AppLogo />
          <span className="font-medium">Phillogix Systems Inc.</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={initials} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
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
              className="font-medium hover:bg-red-100"
            >
              {loading ? (
                <Fragment>
                  <Loader className="animate-spin" />
                  Signing out...
                </Fragment>
              ) : (
                <Fragment>
                  <LogOut />
                  Sign out
                </Fragment>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
