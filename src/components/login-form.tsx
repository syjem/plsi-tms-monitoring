'use client';

import { Google } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailStepProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: EmailStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<'google' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onFormSubmit = (data: EmailFormData) => {
    onSubmit(data.email);
  };

  const handleSocialLogin = async (provider: 'google') => {
    const supabase = createClient();
    setLoadingProvider(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoadingProvider(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            placeholder="me@example.com"
            className="pl-10 border-gray-400 dark:border-border"
            {...register('email')}
          />
        </div>
      </div>
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message}</p>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full shadow-sm cursor-pointer dark:text-gray-50"
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin ml-1" />
            Logging in...
          </>
        ) : (
          'Log in'
        )}
      </Button>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300 dark:after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <div className="grid">
        <Button
          type="button"
          disabled={loadingProvider !== null}
          variant="outline"
          className="w-full border-gray-300 dark:border-border shadow-sm cursor-pointer"
          onClick={() => handleSocialLogin('google')}
        >
          {loadingProvider === 'google' ? (
            <>
              <Loader className="animate-spin ml-1" />
              Continuing...
            </>
          ) : (
            <>
              <Google />
              Continue with Google
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="text-sm text-destructive text-center">{error}</div>
      )}
    </form>
  );
}
