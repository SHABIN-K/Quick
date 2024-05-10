import Image from "next/image";
import ForgetPass from "../components/ForgetPass";

const Home = () => {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height="48"
          width="55"
          className="mx-auto w-auto"
          src="/images/quick-logo.png"
        />
      </div>
      <ForgetPass />
      <h6 className="mt-6 text-center text-sm text-gray-500">
        ©2024 Quick.inc ,All rights reserved.
      </h6>
    </div>
  );
};

export default Home;
