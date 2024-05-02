import { getConversationById, getMessages } from "@/actions/getChats";
import EmptyState from "@/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
  chatId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById({
    chatId: params.chatId as string,
  });

  const messages = await getMessages({
    chatId: params.chatId as string,
  });

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation.data.data[0]} />
        <Body initialMessages={messages.data.data} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
