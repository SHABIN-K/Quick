import Pusher from 'pusher';

export const pusherServer = new Pusher({
  appId: process.env.APP_PUSHER_ID!,
  key: process.env.APP_PUSHER_KEY!,
  secret: process.env.APP_PUSHER_SECRET!,
  cluster: process.env.APP_PUSHER_CLUSTER as string,
  useTLS: true,
  //encrypted: true
});
