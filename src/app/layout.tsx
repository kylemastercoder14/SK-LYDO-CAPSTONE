import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { ModeToggle } from '@/components/globals/toggle-theme';
import "./globals.css";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SANGGUNIANG KABATAAN FEDERATION OF THE CITY OF DASMARIÑAS",
  description:
    "DEVELOPMENT OF AN ADMINISTRATIVE OPERATION SYSTEM FOR SANGGUNIANG KABATAAN FEDERATION OF THE CITY OF DASMARIÑAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ModeToggle />
          <Toaster richColors position='top-right' />
        </ThemeProvider>
      </body>
    </html>
  );
}
