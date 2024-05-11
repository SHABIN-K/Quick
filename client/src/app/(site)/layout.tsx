import Image from "next/image";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        {children}
      </div>
      <h6 className="mt-6 text-center text-sm text-gray-500">
        ©2024 Quick.inc ,All rights reserved.
      </h6>
    </div>
  );
}
