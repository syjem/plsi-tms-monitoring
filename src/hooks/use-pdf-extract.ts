import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type FileError,
  type FileRejection,
  useDropzone,
} from "react-dropzone";

interface FileWithPreview extends File {
  preview?: string;
  errors: readonly FileError[];
}

type UsePDFExtractOptions = {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
};

type ExtractResult = {
  success: boolean;
  data?: any;
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
  const [result, setResult] = useState<ExtractResult | null>(null);

  const isSuccess = useMemo(() => result?.success ?? false, [result?.success]);

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
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log(data.data);
        setResult({ success: true, data: data.data });
      } else {
        setErrors([
          { name: files[0].name, message: data.error || "Extraction failed" },
        ]);
        setResult({ success: false, error: data.error });
      }
    } catch (err) {
      console.log(err);
      setErrors([{ name: files[0].name, message: "Network or server error" }]);
      setResult({ success: false, error: "Network or server error" });
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
    result,
    isSuccess,
    onExtract,
    maxFileSize,
    maxFiles,
    ...dropzoneProps,
  };
};
