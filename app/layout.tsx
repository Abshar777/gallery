import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ReactQueryProvider from "@/components/provider/react-query";

export const metadata: Metadata = {
  title: "gallery",
  description: " gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans dark ${GeistSans.variable} relative ${GeistMono.variable}`}
      >
        <Toaster position="bottom-right" richColors />
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
