"use client";

import { WorkLogs } from "@/types";
import { Dropzone } from "@/components/dropzone";
import FileManager from "@/components/file-manager";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TabSection({ logs }: { logs: WorkLogs[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "upload";

  const [tab, setTab] = useState(currentTab);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (value: string) => {
    setTab(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", value);

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    });
  };

  return (
    <main className="mt-6 max-w-xl mx-auto px-4">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger
            value="upload"
            className="px-4 py-2"
            disabled={isPending}
          >
            Upload
          </TabsTrigger>
          <TabsTrigger value="files" className="px-4 py-2" disabled={isPending}>
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Dropzone />
        </TabsContent>

        <TabsContent value="files">
          <FileManager logs={logs} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default TabSection;
