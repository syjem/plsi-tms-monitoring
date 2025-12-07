import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabSectionSkeleton() {
  return (
    <section className="mt-6 max-w-xl mx-auto px-4">
      <Tabs defaultValue="upload">
        <TabsList className="dark:bg-slate-800/80">
          <TabsTrigger
            value="upload"
            className="px-4 py-2 data-[state=active]:text-muted-foreground dark:data-[state=active]:text-muted-foreground data-[state=active]:border-transparent dark:data-[state=active]:border-transparent data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent"
          >
            Upload
          </TabsTrigger>
          <TabsTrigger value="files" className="px-4 py-2">
            Files
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="rounded-lg border-2 border-dashed bg-white dark:bg-slate-900 transition-all duration-500 border-gray-300 dark:border-slate-800 hover:border-gray-400 dark:hover:border-gray-700 hover:shadow-md">
            <Skeleton className="h-[208px] w-full dark:bg-inherit" />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
