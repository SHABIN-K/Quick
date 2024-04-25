"use client";

import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button, Input } from "@/components";
import AuthSocialButton from "./AuthSocialButton";
import { useSession } from "@/context/AuthContext";
import { signInApi, signUpApi } from "@/helpers/apis/auth";

type Variant = "LOGIN" | "REGISTER";

interface ErrorObject {
  [key: string]: string | string[];
}

const AuthForm = () => {
  const router = useRouter();
  const session = useSession();
  const [, setCookie] = useCookies(["token"]);

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<ErrorObject>({});
  const [variant, setVariant] = useState<Variant>("LOGIN");

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/chats");
    }
  }, [router, session?.status]);

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

        if (res.data.success) {
          toast.success("Welcome to Quick! Your account is ready to use");
          setCookie("token", res.data.data.confirmToken, {
            path: "/",
          });

          //remove token fomr response data
          const { confirmToken, ...userData } = res.data.data;
          const userDataJSON = JSON.stringify(userData);
          localStorage.setItem("user.profile", userDataJSON);
          router.push("/chats");
        }
      } catch (err: any) {
        const errMsg = err.response.data.message;
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

        if (res.data.success) {
          toast.success(`Great to see you again, ${res.data.data.name}!`);
          setCookie("token", res.data.data.accessToken, {
            path: "/",
          });

          //remove token fomr response data
          const { accessToken, ...userData } = res.data.data;
          const userDataJSON = JSON.stringify(userData);
          localStorage.setItem("user.profile", userDataJSON);
          router.push("/chats");
        }
        console.log(res.data);
      } catch (err: any) {
        const errMsg = err.response.data.message;
        setErrMsg(errMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const socialAction = (action: string) => {
    toast("Shhh... Something Quick is brewing.", {
      icon: "🤫",
      style: {
        borderRadius: "10px",
      },
    });
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
                errorMsg={errMsg.name ? errMsg.name : ""}
              />
              <Input
                id="username"
                label="Username"
                register={register}
                errors={errors}
                disabled={isLoading}
                errorMsg={errMsg.username ? errMsg.username : ""}
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
            errorMsg={errMsg.email ? errMsg.email : ""}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            errorMsg={errMsg.password ? errMsg.password : ""}
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

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

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
