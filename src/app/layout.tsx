import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "OpenDrive",
  description: "Professional vehicle valuation system powered by eValue8",
  icons: {
    icon: "https://i.ibb.co/j99h3B9j/Logotrans.png",
    shortcut: "https://i.ibb.co/j99h3B9j/Logotrans.png",
    apple: "https://i.ibb.co/j99h3B9j/Logotrans.png",
  },
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
        {children}
      </body>
    </html>
  );
}
