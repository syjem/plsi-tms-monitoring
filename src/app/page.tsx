"use client";

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
    <Dropzone {...props}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
}
