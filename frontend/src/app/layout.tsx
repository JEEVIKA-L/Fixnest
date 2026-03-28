import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import "./globals.css";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "FixNest - Modern Project Management",
 description: "A premium Trello-style Kanban experience.",
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
 suppressHydrationWarning
 >
 <ThemeInitializer />
 <AnimatedBackground />
 {children}
 <Toaster 
 position="bottom-right" 
 richColors 
 expand={true}
 visibleToasts={5}
 toastOptions={{
 style: {
 borderRadius: '16px',
 border: '1px solid #E5E7EB',
 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
 },
 }}
 />
 </body>
 </html>
 );
}
