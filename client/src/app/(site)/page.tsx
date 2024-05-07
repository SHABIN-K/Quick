import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height="48"
          width="65"
          className="mx-auto w-auto"
          src="/images/quick-logo.png"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Ready to Quick chat?
        </h2>
      </div>
      <AuthForm />
      <h6 className="mt-6 text-center text-sm text-gray-500">
        ©2024 Quick.inc ,All rights reserved.
      </h6>
    </div>
  );
}
