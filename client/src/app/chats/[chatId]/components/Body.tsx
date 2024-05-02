"use client";

import { FullMessageType } from "@/shared/types";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  console.log(initialMessages);

  return <div>Body</div>;
};

export default Body;
