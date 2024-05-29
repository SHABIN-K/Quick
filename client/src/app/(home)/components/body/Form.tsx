"use client";

import React from "react";
import { BsEmojiWink } from "react-icons/bs";
import { HiPaperAirplane } from "react-icons/hi2";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import axios from "@/config/api";
import MessageInput from "./MessageInput";
import useConversation from "@/hooks/useConversation";

const Form = () => {
  const { conversationId } = useConversation();
  const [open, setOpen] = React.useState<boolean>(false);
  const emojiPickerRef = React.useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });

    axios.post("/chats/msg/create-msg", {
      ...data,
      conversationId,
    });
  };

  const handleEmoji = (emojiObject: EmojiClickData) => {
    const { message } = getValues();
    setValue("message", message + emojiObject.emoji);
    setOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <div ref={emojiPickerRef}>
          <p
            onClick={() => setOpen(true)}
            className="relative rounded-full p-2 cursor-pointer transition hover:bg-neutral-100"
          >
            <BsEmojiWink size={20} className="text-sky-400" />
            <div className="absolute bottom-[60px]">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </p>
        </div>

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
