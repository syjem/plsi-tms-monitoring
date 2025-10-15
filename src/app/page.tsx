"use client";

import React from "react";
import { PdfExtractor } from "@/components/dropzone";

export default function Home() {
  return (
    <React.Fragment>
      <HeroSection />
      <PdfExtractor />
    </React.Fragment>
  );
}

function HeroSection() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:pt-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl font-sans">
        Employee Monitoring Attendance Sheet
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Easily manage attendance records — <br /> upload your daily log PDFs,
        extract the data, make quick edits, and print your monitoring in just a
        few clicks.
      </p>
    </div>
  );
}
