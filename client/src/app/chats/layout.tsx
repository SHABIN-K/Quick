import Sidebar from "@/components/sidebar/Sidebar";
import UserList from "./components/UserList";

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
