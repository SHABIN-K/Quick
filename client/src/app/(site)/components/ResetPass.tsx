/* eslint-disable react/no-unescaped-entities */
"use client";
import { Button, Input } from "@/components";
import { resetPassApi } from "@/actions/getAuth";

import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

interface ErrorObject {
  [key: string]: string | string[];
}

const ResetPass = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<ErrorObject>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { password, confirmPassword } = data;
    setIsLoading(true);
    try {
      //validate the password

      if (!password || !confirmPassword) {
        setErrMsg({
          password: !password ? ["Password can not be empty"] : "",
          confirmPassword: !confirmPassword
            ? ["confirmPassword can not be empty"]
            : "",
        });
        return;
      }

      if (password !== confirmPassword) {
        setErrMsg({ confirmPassword: ["The passwords do not match"] });
        return;
      }

      // Proceed with your API call or any other logic here

      const res = await resetPassApi({
        password: confirmPassword,
        token: params.secretId as string,
      });

      if (res?.data?.success) {
        toast.success("You're good to go! Your password has been updated.");
        setTimeout(() => (window.location.href = "/"), 1000);
      }
    } catch (err: any) {
      var errMsg = err?.response?.data;
      if (errMsg?.status === 403) {
        toast.error(errMsg?.message);
        setTimeout(() => (window.location.href = "/forget-pass"), 1000);
      }
      setErrMsg(errMsg.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
          Create new password?
        </h1>
        <p className="font-light text-gray-500">
          Your new password must be different from the previous used passwords
        </p>
        <form
          className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="password"
            label="New password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            errorMsg={errMsg?.password ? errMsg.password : ""}
            required={true}
            placeholder="•••••••"
          />
          <Input
            id="confirmPassword"
            label="confirm password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            required={true}
            errorMsg={errMsg?.confirmPassword ? errMsg.confirmPassword : ""}
            placeholder="•••••••"
          />

          <Button disabled={isLoading} fullWidth type="submit">
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
