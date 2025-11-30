'use client';

import { sendOtpToNewUser } from '@/app/actions/auth/send-otp-to-new-user';
import { OnboardingForm } from '@/app/auth/_components/onboarding-form';
import { AppLogo } from '@/components/icons';
import { LoginForm } from '@/components/login-form';
import React, { useState } from 'react';
import { toast } from 'sonner';

export type AuthStep = 'email' | 'onboarding';

export default function Page() {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail);

    const { success, message } = await sendOtpToNewUser(submittedEmail);

    if (!success) {
      toast.error(message || 'Failed to send verification code.');
    } else {
      toast.success(message);
      setStep('onboarding');
    }
  };

  const handleBack = () => {
    setStep('email');
  };

  return (
    <main className="min-h-svh flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-6">
            {step === 'email' && (
              <React.Fragment>
                <div className="w-full flex items-center justify-center mb-4">
                  <AppLogo />
                </div>
                Phillogix Systems Employee <br /> Monitoring
              </React.Fragment>
            )}
            {step === 'onboarding' && 'Verify and complete your profile'}
          </h1>
        </div>

        {step === 'email' && <LoginForm onSubmit={handleEmailSubmit} />}

        {step === 'onboarding' && (
          <OnboardingForm email={email} onBack={handleBack} />
        )}
      </div>
    </main>
  );
}
