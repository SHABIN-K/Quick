import { useEffect, useState } from "react";
import { Channel, Members } from "pusher-js";

import { pusherClient } from "@/config/pusher";
import useActiveListStore from "../store/useActiveList";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveListStore();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.info.email)
      );
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.info.email);
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.info.email);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, add, remove, set]);
};

export default useActiveChannel;
