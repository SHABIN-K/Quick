import Pusher from "pusher-js";

export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    channelAuthorization: {
      endpoint: "/api/auth/pusher",
      transport: "ajax",
    },
    cluster: "ap2",
  }
);
