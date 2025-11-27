import { getClaims } from '@/app/actions/get-claims';
import { getWorkLogs } from '@/app/actions/logs/get-work-logs';
import { Header } from '@/components/header';
import TabSection from '@/components/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import React from 'react';

export default async function Home() {
  const [{ user }, { data, error }] = await Promise.all([
    getClaims(),
    getWorkLogs(),
  ]);

  return (
    <React.Fragment>
      <Header user={user} />
      <HeroSection name={user.user_metadata.full_name} />
      {error && <ErrorAlert error={error} />}
      <TabSection logs={data ?? []} />
    </React.Fragment>
  );
}

async function HeroSection() {
  const { user } = await getClaims();

  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:pt-10 px-4 sm:px-6 lg:px-8">
      <p className="font-semibold text-base text-gray-700 dark:text-gray-300 mb-6 font-mono">
        Welcome,{' '}
        <span className="text-primary">{user.user_metadata.full_name}~</span>
      </p>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 font-sans">
        Phillogix Systems Employee <br /> Monitoring
      </h1>
    </div>
  );
}

function ErrorAlert({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center">
      <Alert variant="destructive" className="max-w-fit">
        <AlertCircleIcon />
        <AlertTitle>Internal Server Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
}
