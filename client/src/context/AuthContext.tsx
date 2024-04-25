"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

type AuthStatus = "authenticated" | "unauthenticated" | "pending";

interface AuthContextType {
  status: AuthStatus;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cookies] = useCookies(["token"]);
  const [status, setStatus] = useState<AuthStatus>("pending");
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        
        const isAuthenticated = cookies.token ? true : false;
        console.log(isAuthenticated);
        setStatus(isAuthenticated ? "authenticated" : "unauthenticated");
      } catch (error) {
        console.error("Error checking authentication:", error);
        setStatus("unauthenticated");
      }
    };

    checkAuthentication();
  }, [cookies]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <AuthContext.Provider value={{ status }}>{children}</AuthContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context;
};
