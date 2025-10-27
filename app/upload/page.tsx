"use client";
import Gallery from "@/components/gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Uploader } from "@/components/upload/uploader";
import { useCreateScreen, useScreens } from "@/hooks/useScreens";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadPage() {
  const [currentScreen, setCurrentScreen] = useState<string>("1");
  const router = useRouter();
  const searchParams = useSearchParams();
  const screen = searchParams.get("screen") || "1";

  const { screens, isPending, isFetched, refetch, isFetching } = useScreens();
  const handleScreenChange = (value: string) => {
    setCurrentScreen(`${value}`);
    router.push(`/upload?screen=${value}`);
  };

  useEffect(() => {
    setCurrentScreen(screen);
  }, [screen]);

  const {
    mutate: createScreen,
    isPending: isCreatingScreen,
  } = useCreateScreen();
  return (
    <>
      <main className="mx-auto max-w-4xl relative p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-pretty">Image Upload</h1>
          <p className="text-muted-foreground mt-2">
            Drag and drop images, preview them client-side, select one as
            current, and upload to Cloudinary.
          </p>
        </header>

        <Tabs value={currentScreen} onValueChange={handleScreenChange}>
          <TabsList defaultValue="1" className="mb-4 flex-wrap w-fit ">
            {screens.map((screen) => (
              <TabsTrigger key={screen} value={screen.split(" ")[1]}>
                {screen}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-balance">Upload images</CardTitle>
          </CardHeader>
          <CardContent>
            <Uploader screenId={currentScreen} />
          </CardContent>
        </Card>
        <div className="mt-6">
          <Gallery screenId={currentScreen} />
        </div>
      </main>
      <div className="fixed bottom-0 right-0 p-4">
        <Button disabled={isCreatingScreen} onClick={() => createScreen({})}>   {isCreatingScreen ? <Loader2 className="animate-spin" /> : "Add Screen +"}</Button>
      
      </div>
    </> 
  );
}
