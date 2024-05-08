import Pusher from "pusher-js";
import Cookies from "js-cookie";

const auth = Cookies.get("-secure-node-authToken");

export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    channelAuthorization: {
      endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/pusher`,
      transport: "ajax",
      headers: { Authorization: `Bearer ${auth}` },
    },
    cluster: "ap2",
  }
);
