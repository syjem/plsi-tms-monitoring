import React, { Suspense } from "react";
import TabSection from "@/components/tabs";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { getClaims } from "@/app/actions/get-claims";
import { getWorkLogs } from "@/app/actions/logs/get-work-logs";
import { HeroSectionSkeleton } from "@/components/skeletons/hero-section";

export default async function Home() {
  const [{ user }, { data, error }] = await Promise.all([
    getClaims(),
    getWorkLogs(),
  ]);

  if (error) {
    notFound();
  }

  return (
    <React.Fragment>
      <Header user={user} />
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>
      <TabSection logs={data ?? []} />
    </React.Fragment>
  );
}

async function HeroSection() {
  const { user } = await getClaims();

  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:pt-10 px-4 sm:px-6 lg:px-8">
      <p className="font-semibold text-base text-gray-700 dark:text-gray-300 mb-6 font-mono">
        Welcome,{" "}
        <span className="text-primary">{user.user_metadata.full_name}~</span>
      </p>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 font-sans">
        Phillogix Systems Employee <br /> Monitoring
      </h1>
    </div>
  );
}
