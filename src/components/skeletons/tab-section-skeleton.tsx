import { Dropzone } from '@/components/dropzone';
import { EmptyFileManager } from '@/components/file-manager-empty';
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
          <Dropzone />
        </TabsContent>
        <TabsContent value="files">
          <EmptyFileManager />
        </TabsContent>
      </Tabs>
    </section>
  );
}
