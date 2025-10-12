"use client";

import React from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { usePDFExtract } from "@/hooks/use-pdf-extract";

export default function Home() {
  const props = usePDFExtract({
    allowedMimeTypes: ["application/pdf"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 5, // 5MB,
  });

  return (
    <React.Fragment>
      <HeroSection />
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </React.Fragment>
  );
}

function HeroSection() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:py-20 px-4 sm:px-6 lg:px-8">
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
