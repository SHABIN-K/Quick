import ConversationList from "./components/ConversationList";

export default function GroupLayout({
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
