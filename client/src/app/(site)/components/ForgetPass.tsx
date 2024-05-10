/* eslint-disable react/no-unescaped-entities */
"use client";
import { forgetPassApi } from "@/actions/getAuth";
import { Button, Input } from "@/components";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ErrorObject {
  [key: string]: string | string[];
}

const ForgetPass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<ErrorObject>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    setIsLoading(true);
    try {
      const res = await forgetPassApi({
        email: data.email,
      });

      if (res?.data?.success) {
        toast.success(
          "Heads up! We've sent a password reset link to your inbox"
        );
        setTimeout(() => window.location.href = "/" , 1000);
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message;
      setErrMsg(errMsg);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
          Forgot your password?
        </h1>
        <p className="font-light text-gray-500">
          Don't fret! Just type in your email and we will send you a link to
          reset your password!
        </p>
        <form
          className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="email"
            label="Your email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
            errorMsg={errMsg?.email ? errMsg.email : ""}
            placeholder="name@mail.com"
          />

          <Button disabled={isLoading} fullWidth type="submit">
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPass;
