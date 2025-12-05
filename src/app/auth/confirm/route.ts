import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token_hash');
  const next = searchParams.get('next') ?? '/';

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: token!,
    type: 'email',
  });

  if (!error) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent(
      error.message || 'Failed to confirm email.',
    )}`,
  );
}
