import { useEffect, useState } from "react";
import { Channel } from "pusher-js";

import { pusherClient } from "@/config/pusher";
import useAuthStore from "@/store/useAuth";

const useCallingChannel = () => {
  const { session } = useAuthStore();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("private-video-call");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Successfully subscribed to the video call channel.");
    });

    channel.bind(
      "incoming-call",
      ({ callerId, calleeId }: { callerId: string; calleeId: string }) => {
        if (calleeId === session.id) {
          console.log("Incoming call from: ", callerId);
          // Handle the incoming call logic here, e.g., display the call notification.
        }
      }
    );

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("private-video-call");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, session.id]);
};

export default useCallingChannel;
