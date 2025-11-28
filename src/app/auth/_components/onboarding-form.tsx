'use client';

import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Camera, Loader2, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const onboardingSchema = z.object({
  verificationCode: z.string().length(6, 'Verification code must be 6 digits'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  email: string;
  onBack: () => void;
}

export function OnboardingForm({ email, onBack }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      verificationCode: '',
      firstName: '',
      lastName: '',
    },
  });

  const verificationCode = watch('verificationCode');
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsResending(false);
  };

  const onFormSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Form submitted:', { ...data, email, avatar: avatarPreview });

    setIsLoading(false);
    alert('Account created successfully! (Demo)');
  };

  const getInitials = () => {
    const f = firstName?.charAt(0)?.toUpperCase() || '';
    const l = lastName?.charAt(0)?.toUpperCase() || '';
    return f + l || '?';
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Verification Code */}
      <div className="space-y-3">
        <div className="text-center space-y-1">
          <Label className="w-full flex justify-center">
            Verification code
          </Label>
          <p className="text-xs text-muted-foreground">
            Enter the 6-digit code sent to {email}
          </p>
        </div>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={verificationCode}
            onChange={(value) => setValue('verificationCode', value)}
          >
            <InputOTPGroup>
              <InputOTPSlot
                className="border-gray-300 dark:border-border"
                index={0}
              />
              <InputOTPSlot
                className="border-gray-300 dark:border-border"
                index={1}
              />
              <InputOTPSlot
                className="border-gray-300 dark:border-border"
                index={2}
              />
              <InputOTPSlot
                className="border-gray-300 dark:border-border"
                index={3}
              />
              <InputOTPSlot
                className="border-gray-300 dark:border-border"
                index={4}
              />
              <InputOTPSlot
                className="border-gray-300 dark:border-border"
                index={5}
              />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {errors.verificationCode && (
          <p className="text-sm text-destructive text-center">
            {errors.verificationCode.message}
          </p>
        )}
        <Button
          type="button"
          variant="link"
          size="sm"
          className="block text-xs mx-auto"
          onClick={handleResendCode}
          disabled={isResending}
        >
          {isResending ? 'Resending...' : "Didn't receive a code? Resend"}
        </Button>
      </div>

      <div className="border-t border-border" />

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={avatarPreview || undefined} />
            <AvatarFallback className="text-lg bg-muted">
              {firstName || lastName ? (
                getInitials()
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <p className="text-xs text-muted-foreground">
          Click to upload avatar (optional)
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            className="border-gray-400 dark:border-border"
            {...register('firstName')}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            className="border-gray-400 dark:border-border"
            {...register('lastName')}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          className="w-full dark:text-gray-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Use a different email
        </Button>
      </div>
    </form>
  );
}
