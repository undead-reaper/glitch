import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/services/trpc/client";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Fira_Code, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glitch",
  description:
    "Your story, your stage. Discover and share videos on a platform for everyone. Upload, connect, and build your community through content that speaks to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} ${firaCode.variable} antialiased`}>
          <ThemeProvider attribute="class">
            <TRPCProvider>
              <Toaster richColors duration={2000} />
              {children}
            </TRPCProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
