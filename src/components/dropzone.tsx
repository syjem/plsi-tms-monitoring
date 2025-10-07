"use client";

import { cn, formatBytes } from "@/lib/utils";
import { type usePDFExtract } from "@/hooks/use-pdf-extract";
import { Button } from "@/components/ui/button";
import { File, Loader2, Upload, X } from "lucide-react";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* --------------------------- Context Setup --------------------------- */

type DropzoneContextType = Omit<
  ReturnType<typeof usePDFExtract>,
  "getRootProps" | "getInputProps"
>;

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined
);

type DropzoneProps = ReturnType<typeof usePDFExtract> & {
  className?: string;
};

/* ----------------------------- Root Wrapper -------------------------- */

const Dropzone = ({
  className,
  children,
  getRootProps,
  getInputProps,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const { files, errors, extractedData, isDragActive, isDragReject } =
    restProps;

  const isSuccess = !!extractedData;
  const isActive = restProps.isDragActive;

  const hasFileErrors = files.some((file) => file.errors.length > 0);
  const isInvalid =
    (isDragActive && isDragReject) ||
    (errors.length > 0 && !extractedData) ||
    hasFileErrors;

  return (
    <DropzoneContext.Provider value={{ ...restProps }}>
      <div className="w-full md:w-1/2 px-4 md:px-0 h-full mx-auto flex items-center justify-center">
        <div
          {...getRootProps({
            className: cn(
              "flex-1 border-2 border-gray-300 rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground",
              className,
              isSuccess ? "border-solid" : "border-dashed",
              isActive && "border-primary bg-primary/10",
              isInvalid && "border-destructive bg-destructive/10"
            ),
          })}
        >
          <input {...getInputProps()} />
          {children}
        </div>
      </div>
    </DropzoneContext.Provider>
  );
};

const DropzoneContent = ({ className }: { className?: string }) => {
  const {
    files,
    setFiles,
    onExtract,
    loading,
    extractedData,
    errors,
    maxFileSize,
    maxFiles,
  } = useDropzoneContext();
  const router = useRouter();

  const exceedMaxFiles = files.length > maxFiles;

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      setFiles(files.filter((file) => file.name !== fileName));
    },
    [files, setFiles]
  );

  useEffect(() => {
    if (extractedData) {
      localStorage.setItem("attendanceData", JSON.stringify(extractedData));

      router.push("/monitoring");
    }
  }, [extractedData, router]);

  return (
    <div className={cn("flex flex-col", className)}>
      {files.map((file, idx) => {
        const fileError = errors.find((e) => e.name === file.name);

        return (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center gap-x-4 py-2 first:mt-4 last:mb-4 "
          >
            {file.type?.startsWith("image/") ? (
              <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                <Image
                  width={40}
                  height={40}
                  src={file.preview!}
                  alt={file.name}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center">
                <File size={18} />
              </div>
            )}

            <div className="shrink grow flex flex-col items-start truncate">
              <p
                title={file.name}
                className="text-sm truncate max-w-full text-foreground"
              >
                {file.name}
              </p>
              {file.errors.length > 0 ? (
                <p className="text-xs text-destructive">
                  {file.errors
                    .map((e) =>
                      e.message.startsWith("File is larger than")
                        ? `File is larger than ${formatBytes(
                            maxFileSize,
                            2
                          )} (Size: ${formatBytes(file.size, 2)})`
                        : e.message.startsWith("File type must be application/")
                        ? `File type not allowed.`
                        : e.message
                    )
                    .join(", ")}
                </p>
              ) : loading ? (
                <p className="text-xs text-muted-foreground">
                  Extracting file...
                </p>
              ) : !!fileError ? (
                <p className="text-xs text-destructive">
                  Failed to extract: {fileError.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size, 2)}
                </p>
              )}
            </div>

            {!loading && (
              <Button
                size="icon"
                variant="link"
                className="shrink-0 justify-self-end text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveFile(file.name)}
              >
                <X />
              </Button>
            )}
          </div>
        );
      })}
      {exceedMaxFiles && (
        <p className="text-sm text-left mt-2 text-destructive">
          You may upload only up to {maxFiles} PDF file, please remove the
          others.
        </p>
      )}
      {files.length > 0 && !exceedMaxFiles && (
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={onExtract}
            disabled={files.some((file) => file.errors.length !== 0) || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              <>Extract</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { maxFiles, maxFileSize, inputRef } = useDropzoneContext();

  return (
    <div className={cn("flex flex-col items-center gap-y-2", className)}>
      <Upload size={20} className="text-muted-foreground" />
      <p className="text-base font-semibold">Upload PDF</p>
      <div className="flex flex-col items-center gap-y-1">
        <p className="text-sm text-muted-foreground">
          Drag and drop or{" "}
          <a
            onClick={() => inputRef.current?.click()}
            className="underline cursor-pointer transition hover:text-foreground"
          >
            select {maxFiles === 1 ? `file` : "files"}
          </a>{" "}
          to upload
        </p>
        {maxFileSize !== Number.POSITIVE_INFINITY && (
          <p className="text-xs text-muted-foreground font-semibold">
            Maximum file size: {formatBytes(maxFileSize, 2)}
          </p>
        )}
      </div>
    </div>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

export { Dropzone, DropzoneContent, DropzoneEmptyState, useDropzoneContext };
