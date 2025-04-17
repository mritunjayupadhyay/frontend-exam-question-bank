import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/react-query-hooks/query.provider";
import { ReduxProvider } from "@/rtk/redux.provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ReduxProvider>
            <div className="[--header-height:calc(--spacing(20))]">
              <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                  <AppSidebar />
                  <SidebarInset>
                    <div className="flex flex-1 flex-col gap-4 p-4 bg-surfaceContainer h-[calc(100svh-var(--header-height))]"
                      style={{ background: "var(--Schemes-Surface-Container, #F3F0F4)" }}
                    >
                      {children}
                    </div>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
