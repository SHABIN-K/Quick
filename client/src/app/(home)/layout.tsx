import Sidebar from "@/components/sidebar/Sidebar";
import { ProtectedLayout } from "@/components/ProtectedLayout";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <Sidebar>{children}</Sidebar>
    </ProtectedLayout>
  );
}
