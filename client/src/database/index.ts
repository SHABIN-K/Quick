import Dexie, { Table } from "dexie";
import { FullConversationType, User } from "@/shared/types";

class QuickDatabase extends Dexie {
  public chats!: Table<FullConversationType, string>;
  public groupchat!: Table<FullConversationType, string>;
  public users!: Table<User, string>;

  constructor() {
    super("quick-database");
    this.version(1).stores({
      chats: "id",
      groupchat: "id",
      users: "id",
    });
  }
}

const db = new QuickDatabase();

export { db };
