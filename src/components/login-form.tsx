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
            <h1 className="text-xl md:text-2xl font-bold text-center mb-6">
              Phillogix Systems Employee <br /> Monitoring
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                className="border-gray-400"
              />
            </div>
            <Button type="submit" className="w-full shadow-sm">
              Login
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
          <div className="grid">
            <Button
              type="button"
              disabled={loadingProvider !== null}
              variant="outline"
              className="w-full border-gray-300 shadow-sm"
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
    </div>
  );
}
