import Dexie, { Table } from "dexie";
import { FullConversationType } from "@/shared/types";

const db = new Dexie("quick-database") as Dexie & {
  chats: Table<FullConversationType, string>;
};

// Schema declaration:
db.version(1).stores({
  chats: "id",
});

export { db };
