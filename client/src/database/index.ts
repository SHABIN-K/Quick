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

    // Log a message when the database is ready
    this.on("ready", () => {
      console.log("Dexie database is ready");
    });

    // Log a message when the database is populated with initial data
    this.on("populate", async () => {
      console.log("Populating initial data");
      // Add your initial data population logic here
    });

    // Catch database errors and log them
    this.on("versionchange", (event) => {
      console.warn("Database version changed", event);
    });

    this.on("blocked", (event) => {
      console.warn("Database blocked", event);
    });

    this.on("close", () => {
      console.log("Database closed");
    });
  }
}

const db = new QuickDatabase();

export { db };
