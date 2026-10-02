import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "8111C - Play & Win",
  description: "Play games and win real money",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#000]`}
    >
      <body className="w-full bg-[#000]">
        <UserProvider>
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </UserProvider>
        <Toaster position="top-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #cc0000" } }} />
      </body>
    </html>
  );
}
