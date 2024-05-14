import ConversationList from "./components/ConversationList";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <ConversationList />
      {children}
    </div>
  );
}
