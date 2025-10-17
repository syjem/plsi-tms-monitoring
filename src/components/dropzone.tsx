"use client";

import { useState, useEffect } from "react";

import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  FileSearch,
  ScanLine,
  FileOutput,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/utils/format-bytes";
import { usePDFExtract } from "@/hooks/use-pdf-extract";

type ExtractionStage = "reading" | "scanning" | "extracting" | "success";

export function PdfExtractor() {
  const router = useRouter();

  const {
    files,
    setFiles,
    loading,
    extractedData,
    onExtract,
    maxFileSize,
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
  } = usePDFExtract({
    allowedMimeTypes: ["application/pdf"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 5, // 5MB
  });

  const file = files[0];
  const hasErrors = file?.errors && file.errors.length > 0;

  const [currentStage, setCurrentStage] = useState<ExtractionStage>("reading");

  const stages: Record<
    ExtractionStage,
    { label: string; icon: React.ReactNode }
  > = {
    reading: {
      label: "Reading your file...",
      icon: <FileSearch className="h-5 w-5" />,
    },
    scanning: {
      label: "Scanning content...",
      icon: <ScanLine className="h-5 w-5" />,
    },
    extracting: {
      label: "Extracting your files...",
      icon: <FileOutput className="h-5 w-5" />,
    },
    success: {
      label: "Extraction complete!",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  };

  useEffect(() => {
    if (!loading) return;

    const stageOrder: ExtractionStage[] = ["reading", "scanning", "extracting"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % stageOrder.length;
      setCurrentStage(stageOrder[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (extractedData) {
      setCurrentStage("success");
      localStorage.setItem("attendanceData", JSON.stringify(extractedData));

      // Show success briefly before navigating
      setTimeout(() => {
        router.push("/monitoring");
        toast.info("Data extracted successfully.");
      }, 1500);
    }
  }, [extractedData, router]);

  const handleRemoveFile = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isSuccess = !!extractedData;

  return (
    <div
      {...getRootProps({
        className: cn(
          "flex-1 relative rounded-lg border-2 border-dashed bg-white p-8 transition-all duration-500",
          !file && "border-gray-300 hover:border-gray-400 hover:shadow-md",
          file && !hasErrors && !loading && !isSuccess && "border-gray-300",
          loading && "border-blue-400 bg-blue-50/50",
          isSuccess && "border-green-400 bg-green-50/50",
          hasErrors && "border-red-400 bg-red-50/50",
          isDragActive && "border-blue-400 bg-blue-50"
        ),
      })}
    >
      <input {...getInputProps()} />

      {/* File Display */}
      {file ? (
        <div
          className={cn(
            "transition-all duration-500",
            file ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-full flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="rounded bg-red-100 p-2">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  {hasErrors ? (
                    <p className="text-xs text-red-600">
                      {file.errors
                        .map((e) =>
                          e.message.startsWith("File is larger than")
                            ? `File is larger than ${formatBytes(
                                maxFileSize,
                                2
                              )} (Size: ${formatBytes(file.size, 2)})`
                            : e.message.startsWith("File type must be")
                            ? "File type not allowed"
                            : e.message
                        )
                        .join(", ")}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {formatBytes(file.size, 2)}
                    </p>
                  )}
                </div>
              </div>
              {!loading && !isSuccess && (
                <button
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {loading && (
                <div className="text-blue-600 animate-pulse">
                  {stages[currentStage].icon}
                </div>
              )}
              {isSuccess && (
                <CheckCircle2 className="h-5 w-5 text-green-600 animate-in zoom-in duration-300" />
              )}
            </div>

            {/* Extraction Progress */}
            {loading && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-pulse bg-[length:200%_100%] w-full" />
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="text-blue-600 animate-spin">
                    <Loader2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium transition-all duration-500">
                    {stages[currentStage].label}
                  </p>
                </div>
                <p className="text-xs text-center text-gray-500 mt-1">
                  This may take 30-40 seconds
                </p>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="w-full text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-sm font-medium text-green-700">
                  Extraction complete!
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Redirecting to monitoring page...
                </p>
              </div>
            )}

            {/* Extract Button */}
            {!loading && !isSuccess && !hasErrors && (
              <Button
                onClick={onExtract}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                Extract
              </Button>
            )}
          </div>
        </div>
      ) : (
        <DropzoneEmptyState inputRef={inputRef} maxFileSize={maxFileSize} />
      )}
    </div>
  );
}

function DropzoneEmptyState({
  inputRef,
  maxFileSize,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  maxFileSize: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 transition-all duration-500 ease-out",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
    >
      <div className="rounded-full bg-gray-100 p-4">
        <Upload className="h-8 w-8 text-gray-600" />
      </div>
      <div className="text-center">
        <span className="text-xl font-semibold text-gray-900 mb-2">
          Upload a PDF
        </span>
        <p className="text-sm text-gray-600">
          Drag and drop or{" "}
          <button
            onClick={() => inputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            select file
          </button>{" "}
          to upload
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: {formatBytes(maxFileSize, 2)}
        </p>
      </div>
    </div>
  );
}
