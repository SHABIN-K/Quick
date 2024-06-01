import Dexie, { Table } from "dexie";
import { FullConversationType, User } from "@/shared/types";

const db = new Dexie("quick-database") as Dexie & {
  chats: Table<FullConversationType, string>;
  groupchat: Table<FullConversationType, string>;
  users: Table<User, string>;
};

// Schema declaration:
db.version(1).stores({
  chats: "id",
  groupchat: "id",
  users: "id",
});

export { db };
