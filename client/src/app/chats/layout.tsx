import Sidebar from "@/components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList />
        {children}
      </div>
    </Sidebar>
  );
}
