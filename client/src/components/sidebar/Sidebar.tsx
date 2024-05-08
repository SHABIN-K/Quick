"use client";
import MobileFooter from "./MobileFooter";
import DesktopSidebar from "./DesktopSidebar";
import { ProtectedLayout } from "../ProtectedLayout";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <div className="h-full">
        <DesktopSidebar />
        <MobileFooter />
        <main className="lg:pl-20 h-full">{children}</main>
      </div>
    </ProtectedLayout>
  );
}
