import Pusher from "pusher-js";

let user;
if (typeof window !== "undefined") {
  const data = localStorage.getItem("user.profile");
  user = JSON.parse(data as string);
}

export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    channelAuthorization: {
      endpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/pusher-auth`,
      transport: "ajax",
      params: { user: user?.email },
    },
    cluster: "ap2",
  }
);
