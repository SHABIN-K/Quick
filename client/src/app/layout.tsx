import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import ActiveStatus from "@/components/ActiveStatus";
import { AuthProvider } from "@/context/AuthContext";
import { CallProvider } from "@/context/CallContext";
import ToasterContext from "@/context/ToasterContext";

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
          <CallProvider>
            <ToasterContext />
            <ActiveStatus />
            {children}
          </CallProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
