import React from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Dropzone } from "@/components/dropzone";
import { getCurrentUser } from "@/app/actions/get-current-user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Files } from "lucide-react";

export default async function Home() {
  const userData = await getCurrentUser();

  if (!userData) {
    return redirect("/auth/login");
  }

  return (
    <React.Fragment>
      <Header userData={userData} />
      <HeroSection name={userData.userName} />
      <main className="mt-6 max-w-xl mx-auto px-4">
        <Tabs defaultValue="dropzone">
          <TabsList>
            <TabsTrigger value="dropzone">Upload</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="dropzone">
            <Dropzone />
          </TabsContent>
          <TabsContent value="files">
            <section className="flex items-center gap-2 5">
              <h3>Manage your files</h3>
              <Files className="size-4 text-muted-foreground" />
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
}

function HeroSection({ name }: { name: string }) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:pt-10 px-4 sm:px-6 lg:px-8">
      <p className="font-semibold text-base text-gray-700 mb-6 font-mono">
        Welcome, <span className="text-blue-500">{name}~</span>
      </p>
      <h1 className="text-2xl font-extrabold text-gray-900 font-sans">
        Phillogix Systems Employee <br /> Monitoring
      </h1>
    </div>
  );
}
