"use client";

import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button, Input } from "@/components";
import { useSession } from "@/context/AuthContext";
import { signInApi, signUpApi } from "@/actions/getAuth";

type Variant = "LOGIN" | "REGISTER";

interface ErrorObject {
  [key: string]: string | string[];
}

const AuthForm = () => {
  const router = useRouter();
  const { status, setSession } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<ErrorObject>({});
  const [variant, setVariant] = useState<Variant>("LOGIN");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chats");
    }
  }, [router, status]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      //Axios Register
      try {
        const res = await signUpApi({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        });

        if (res?.data?.success) {
          toast.success("Welcome to Quick! Your account is ready to use");
          Cookies.set("-secure-node-authToken", res?.data?.data?.confirmToken, {
            expires: 7,
          });

          //remove token fomr response data
          const { confirmToken, ...userData } = res?.data?.data;
          setSession?.(userData);
          router.refresh();
        }
      } catch (err: any) {
        const errMsg = err?.response?.data?.message;
        setErrMsg(errMsg);
      } finally {
        setIsLoading(false);
      }
    }

    if (variant === "LOGIN") {
      //Axios login
      try {
        const res = await signInApi({
          email: data.email,
          password: data.password,
        });

        if (res?.data?.success) {
          toast.success(`Great to see you again, ${res?.data?.data?.name}!`);
          Cookies.set("-secure-node-authToken", res?.data?.data?.accessToken, {
            expires: 7,
          });

          //remove token fomr response data
          const { accessToken, ...userData } = res.data.data;
          setSession?.(userData);
          router.push("/chats");
        }
      } catch (err: any) {
        const errMsg = err?.response?.data?.message;
        setErrMsg(errMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <>
              <Input
                id="name"
                label="Name"
                register={register}
                errors={errors}
                disabled={isLoading}
                errorMsg={errMsg?.name ? errMsg.name : ""}
              />
              <Input
                id="username"
                label="Username"
                register={register}
                errors={errors}
                disabled={isLoading}
                errorMsg={errMsg?.username ? errMsg.username : ""}
              />
            </>
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
            errorMsg={errMsg?.email ? errMsg.email : ""}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            errorMsg={errMsg?.password ? errMsg.password : ""}
          />

          <span className="cursor-pointer text-xs text-gray-500 py-2 hover:underline">
            forget password ?
          </span>

          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN" ? "New to Quick?" : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
