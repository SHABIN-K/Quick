"use client";

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import AuthSocialButton from "./AuthSocialButton";
import { Button, Input } from "@/components";
import { signupApi } from "@/helpers/apis/auth";

type Variant = "LOGIN" | "REGISTER";

interface ErrorObject {
  [key: string]: string | string[];
}

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("REGISTER");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<ErrorObject>({});

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
        const res = await signupApi({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        });

        // Assuming the error message is directly available as res.data.message
        console.log(res.data);
        const err = res.data.message;

        // Set errMsg state with the error message
        setErrMsg(err);
      } catch (err: any) {
        console.log(err.response.data.message);
        const errMsg = err.response.data.message;

        // Set errMsg state with the error message
        setErrMsg(errMsg);
      } finally {
        setIsLoading(false);
      }
    }

    if (variant === "LOGIN") {
      //Axios login
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    console.log(action);
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
