import { getConversationById } from "@/actions/getChats";
import EmptyState from "@/components/EmptyState";

interface IParams {
  chatId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById({
    chatId: params.chatId as string,
  });
  //const messages = await getMessages(params.chatId);
  console.log(conversation);

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
        {/*<Header conversation={conversation} />
        <Body initialMessages={messages} />
  <Form />*/}
      </div>
    </div>
  );
};

export default ConversationId;
