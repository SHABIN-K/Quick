export type CallInfo = {
  email: string;
  socket_id: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  username: string;
  profile: string;
  confirmToken: string;
};

export type User = {
  map(
    arg0: (user: { id: any; name: any }) => { value: any; label: any }
  ): Record<string, any>[];
  id: string;
  name?: string;
  username?: string;
  email?: string;
  emailVerified?: string;
  profile?: string;
  hashedPassword?: string;
  createdAt: string;
  updatedAt: string;

  conversationIds: string[];
  conversations: Conversation[];
  seenMessageIds: string[];
  seenMessages: Message[];
  messages: Message[];
};

export type Conversation = {
  id: string;
  createdAt: string;
  lastMessageAt: string;
  name?: string;
  isGroup?: boolean;
  messagesIds: string[];
  messages: Message[];
  userIds: string[];
  users: User[];
};

export type Message = {
  id: string;
  body?: string;
  image?: string;
  createdAt: string;
  seenIds: string[];
  seen: User[];
  conversationId: string;
  conversation: Conversation;
  senderId: string;
  sender: User;
};

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
