"use client";

import { WorkLogs } from "@/types";
import { Dropzone } from "@/components/dropzone";
import FileManager from "@/components/file-manager";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

function MainSection({ logs }: { logs: WorkLogs[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") || "dropzone";

  const [tab, setTab] = useState(currentTab);

  useEffect(() => {
    setTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="mt-6 max-w-xl mx-auto px-4">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="dropzone" className="px-4 py-2">
            Upload
          </TabsTrigger>
          <TabsTrigger value="files" className="px-4 py-2">
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dropzone">
          <Dropzone />
        </TabsContent>

        <TabsContent value="files">
          <FileManager logs={logs} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default MainSection;
