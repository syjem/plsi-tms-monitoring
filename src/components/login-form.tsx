"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { AppLogo, Google } from "@/components/icons";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<"google" | null>(null);

  const handleSocialLogin = async (provider: "google") => {
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
      setError(error instanceof Error ? error.message : "An error occurred");
      setLoadingProvider(null);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <AppLogo />
            </div>
            <h1 className="text-xl font-bold text-center mb-6">
              Welcome to Phillogix Systems Employee Monitoring
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
          <div className="grid">
            <Button
              type="button"
              disabled={loadingProvider !== null}
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
            >
              <Google />
              {loadingProvider === "google"
                ? "Logging in..."
                : "Continue with Google"}
            </Button>
          </div>
          {error && (
            <div className="text-sm text-destructive text-center">{error}</div>
          )}
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:decoration-primary hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
