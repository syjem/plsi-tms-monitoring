"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { usePDFExtract } from "@/hooks/use-pdf-extract";

const FileUpload = () => {
  const props = usePDFExtract({
    allowedMimeTypes: ["application/pdf"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 5, // 5MB,
  });

  return (
    <div className="w-full md:w-1/2 px-4 md:px-0 h-full mx-auto flex items-center justify-center">
      <Dropzone {...props} className="flex-1">
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

export { FileUpload };
