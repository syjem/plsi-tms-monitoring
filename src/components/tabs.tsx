'use client';

import { Dropzone } from '@/components/dropzone';
import FileManager from '@/components/file-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Logs } from '@/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function MainTab({ logs }: { logs: Logs[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'upload';

  const [tab, setTab] = useState(currentTab);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (value: string) => {
    setTab(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('tab', value);

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    });
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange}>
      <TabsList className="dark:bg-slate-800/80">
        <TabsTrigger
          value="upload"
          className={cn(
            'px-4 py-2',
            tab === 'upload' && 'dark:data-[state=active]:bg-primary',
          )}
          disabled={isPending}
        >
          Upload
        </TabsTrigger>
        <TabsTrigger
          value="files"
          className={cn(
            'px-4 py-2',
            tab === 'files' && 'dark:data-[state=active]:bg-primary',
          )}
          disabled={isPending}
        >
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
  );
}
