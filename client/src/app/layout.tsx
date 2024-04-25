import type { Metadata } from "next";
import {  Inter } from "next/font/google";

import ToasterContext from "@/context/ToasterContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import CookieContext from "@/context/cookieContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick",
  description:
    "Ditch the delays, connect in a heartbeat. It's chat lightning speed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CookieContext>
            <ToasterContext />
            {children}
          </CookieContext>
        </AuthProvider>
      </body>
    </html>
  );
}
