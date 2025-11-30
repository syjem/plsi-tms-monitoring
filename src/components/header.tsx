'use client';

import SignatureMenu from '@/components/custom/signature-menu';
import { AppLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import { JwtPayload } from '@supabase/supabase-js';
import { Loader, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

export function Header({ user }: { user: JwtPayload }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const userName = user.user_metadata.full_name as string;
  const email = user.email;
  const avatarUrl = user.user_metadata.avatar_url;

  const initials = userName
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase();

  const handleSignout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
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
                <address className="text-muted-foreground">{email}</address>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SignatureMenu>
              <DropdownMenuLabel className="cursor-default" role="button">
                My Signature
              </DropdownMenuLabel>
            </SignatureMenu>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? 'dark' : 'light')
                  }
                />
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
