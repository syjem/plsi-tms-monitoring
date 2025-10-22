"use client";

import React from "react";
import { Header } from "@/components/header";
import { PdfExtractor } from "@/components/dropzone";
import { AddBlankSheet } from "@/components/add-blank-sheet";
import { useCurrentUserName } from "@/hooks/use-current-user-name";

export default function Home() {
  return (
    <React.Fragment>
      <Header />
      <HeroSection />
      <section className="mt-6 flex flex-col md:flex-row items-stretch justify-center gap-4 w-full max-w-4xl mx-auto px-4">
        <PdfExtractor />
        <AddBlankSheet />
      </section>
    </React.Fragment>
  );
}

function HeroSection() {
  const name = useCurrentUserName();
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:pt-10 px-4 sm:px-6 lg:px-8">
      <p className="font-semibold text-2xl text-gray-700 mb-6 font-mono">
        Welcome, <span className="text-blue-500">{name}~</span>
      </p>
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl font-sans">
        Phillogix Systems Employee Monitoring
      </h1>
    </div>
  );
}
