'use client';

import { MagicLinkSent } from '@/app/auth/_components/magic-link-sent';
import { OnboardingForm } from '@/app/auth/_components/onboarding-form';
import { AppLogo } from '@/components/icons';
import { LoginForm } from '@/components/login-form';
import React, { useState } from 'react';

export type AuthStep = 'email' | 'magic-link-sent' | 'onboarding';

export default function Page() {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (submittedEmail: string, existingUser: boolean) => {
    setEmail(submittedEmail);

    if (existingUser) {
      setStep('magic-link-sent');
    } else {
      setStep('onboarding');
    }
  };

  const handleBack = () => {
    setStep('email');
    setEmail('');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
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
            {step === 'magic-link-sent' && 'Check your email'}
            {step === 'onboarding' && 'Complete your profile'}
          </h1>
        </div>

        {step === 'email' && <LoginForm onSubmit={handleEmailSubmit} />}
        {step === 'magic-link-sent' && (
          <MagicLinkSent email={email} onBack={handleBack} />
        )}
        {step === 'onboarding' && (
          <OnboardingForm email={email} onBack={handleBack} />
        )}
      </div>
    </main>
  );
}
