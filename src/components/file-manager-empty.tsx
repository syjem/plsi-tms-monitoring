"use client";

import { CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function EmptyFileManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = () => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", "dropzone");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Empty className="">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudUpload />
        </EmptyMedia>
        <EmptyTitle>Empty</EmptyTitle>
        <EmptyDescription>
          Upload your daily logs to see them here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={handleTabChange}>
          Upload Files
        </Button>
      </EmptyContent>
    </Empty>
  );
}
