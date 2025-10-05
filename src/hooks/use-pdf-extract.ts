import { useCallback, useEffect, useState } from "react";
import {
  type FileError,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";

/* ------------------------- Types & Interfaces ------------------------- */

interface FileWithPreview extends File {
  preview?: string;
  errors: readonly FileError[];
}

type UsePDFExtractOptions = {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
};

interface ExtractResponse {
  employee: { id: string; name: string };
  logs: {
    Date: string;
    Day: string;
    Shift: string;
    TimeIn: string;
    BreakOut: string;
    BreakIn: string;
    TimeOut: string;
    Remarks: string;
  }[];
}

type ExtractResult = {
  data?: ExtractResponse;
  error?: string;
};

export const usePDFExtract = (options: UsePDFExtractOptions) => {
  const {
    allowedMimeTypes = ["application/pdf"],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
  } = options;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractResult | null>(
    null
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const validFiles = acceptedFiles
        .filter((file) => !files.find((x) => x.name === file.name))
        .map((file) => {
          (file as FileWithPreview).preview = URL.createObjectURL(file);
          (file as FileWithPreview).errors = [];
          return file as FileWithPreview;
        });

      const invalidFiles = fileRejections.map(({ file, errors }) => {
        (file as FileWithPreview).preview = URL.createObjectURL(file);
        (file as FileWithPreview).errors = errors;
        return file as FileWithPreview;
      });

      setFiles([...files, ...validFiles, ...invalidFiles]);
    },
    [files]
  );

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedMimeTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize: maxFileSize,
    maxFiles,
    multiple: maxFiles !== 1,
  });

  const onExtract = useCallback(async () => {
    if (files.length === 0) return;

    setLoading(true);
    setErrors([]);
    setExtractedData(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await fetch(
        "https://plsi-tms-monitoring-server.vercel.app/api/extract",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.error || "Extraction failed");
        return;
      }

      setExtractedData(result);
    } catch (error) {
      console.error("Extraction error:", error);
      setErrors([{ name: "extract", message: "Failed to extract PDF data" }]);
      toast.error("Failed to extract PDF data");
    } finally {
      setLoading(false);
    }
  }, [files]);

  useEffect(() => {
    if (files.length === 0) {
      setErrors([]);
    }
  }, [files.length]);

  return {
    files,
    setFiles,
    loading,
    errors,
    extractedData,
    onExtract,
    maxFileSize,
    maxFiles,
    ...dropzoneProps,
  };
};
