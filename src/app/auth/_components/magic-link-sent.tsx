'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface MagicLinkSentProps {
  email: string;
  onBack: () => void;
}

export function MagicLinkSent({ email, onBack }: MagicLinkSentProps) {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsResending(false);
    setResent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">We sent a magic link to</p>
        <p className="font-medium text-foreground">{email}</p>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to sign in to your account.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleResend}
          disabled={isResending || resent}
        >
          {isResending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Resending...
            </>
          ) : resent ? (
            'Email resent!'
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend magic link
            </>
          )}
        </Button>

        <Button variant="ghost" className="w-full" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Use a different email
        </Button>
      </div>
    </div>
  );
}
