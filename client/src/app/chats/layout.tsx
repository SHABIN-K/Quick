import UserList from "@/components/UserList";
import Sidebar from "@/components/sidebar/Sidebar";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">
        <UserList />
        {children}
      </div>
    </Sidebar>
  );
}
