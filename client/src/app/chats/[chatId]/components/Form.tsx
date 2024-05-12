"use client";

import useConversation from "@/hooks/useConversation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import axios from "@/config/api";
import useAuthStore from "@/store/useAuth";

const Form = () => {
  const { conversationId } = useConversation();
  const { session } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });

    axios.post("/chats/messages", {
      ...data,
      conversationId,
      userId: session?.email,
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
