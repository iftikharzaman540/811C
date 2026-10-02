import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";

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
      <body className="flex flex-col items-center justify-start w-full">
        <div 
          className="w-full max-w-[400px] min-h-screen bg-[#0a0a0a] relative shadow-[0_0_50px_rgba(255,223,0,0.05)] overflow-x-hidden flex flex-col border-x border-neutral-900"
          style={{ transform: "translateZ(0)" }}
        >
          <UserProvider>{children}</UserProvider>
          <Toaster position="top-center" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #cc0000" } }} />
        </div>
      </body>
    </html>
  );
}
