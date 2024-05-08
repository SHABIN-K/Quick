"use client";

import LoadingModal from "./LoadingModal";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSession } from "@/context/AuthContext";

interface ProtectedtProps {
  children: ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedtProps> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // if the user is authorized,redirect to router
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);
  // if the user is authorized, render the page
  if (status === "authenticated") return <div>{children}</div>;

  // if the user refreshed the page or somehow navigated to the protected page
  return <LoadingModal />;
};

export const ProtectedAuthLayout: React.FC<ProtectedtProps> = ({
  children,
}) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // if the user is authorized,redirect to router
    if (status === "authenticated") router.replace("/chats");
  }, [status, router]);
  // if the user is authorized, render the page
  if (status === "unauthenticated") return <div>{children}</div>;

  // if the user refreshed the page or somehow navigated to the protected page
  return <LoadingModal />;
};
