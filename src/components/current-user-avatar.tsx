'use client';

import { getEngineerSignature } from '@/app/actions/profiles/get-signature';
import SignatureMenu from '@/components/custom/signature-menu';
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
import { useQuery } from '@tanstack/react-query';
import { Loader, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function CurrentUserAvatar({ user }: { user: JwtPayload }) {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [openSignatureDialog, setSignatureDialogState] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryFn: () => getEngineerSignature(),
    queryKey: [user],
    refetchOnWindowFocus: false,
  });

  const router = useRouter();

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
      await supabase.auth.signOut({ scope: 'local' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <SignatureMenu
          isFetching={isFetching}
          data={data}
          open={openSignatureDialog}
          refetch={refetch}
          onOpenChange={setSignatureDialogState}
        >
          <DropdownMenuLabel
            className="cursor-default"
            role="button"
            onClick={() => setSignatureDialogState((prev) => !prev)}
          >
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
            <React.Fragment>
              <Loader className="animate-spin" />
              Signing out...
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LogOut />
              Sign out
            </React.Fragment>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
