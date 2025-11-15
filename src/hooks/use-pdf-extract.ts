"use client";

import {
  type FileError,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { extractAndSave } from "@/app/actions/extract-and-save";

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

export const usePDFExtract = (options: UsePDFExtractOptions) => {
  const router = useRouter();
  const {
    allowedMimeTypes = ["application/pdf"],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
  } = options;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);

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

  const {
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
    ...restDropzoneProps
  } = useDropzone({
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

    try {
      const result = await extractAndSave(files[0]);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("PDF extracted and data saved successfully!");
      router.push(`/monitoring/${result.id}`);
    } catch (error) {
      console.error(error);
      toast.error("An error has occurred, please try again!");
    } finally {
      setLoading(false);
    }
  }, [files, router]);

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
    onExtract,
    maxFileSize,
    maxFiles,
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
    ...restDropzoneProps,
  };
};
