"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";

import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

import { UserType } from "@/shared/types";

type AuthStatus = "authenticated" | "unauthenticated" | "pending";

interface AuthContextType {
  status: AuthStatus;
  getSession?: UserType | null;
  setSession?: Dispatch<UserType | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cookies] = useCookies(["token"]);
  const [status, setStatus] = useState<AuthStatus>("pending");
  const [getSession, setSession] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = cookies.token ? true : false;
        setStatus(isAuthenticated ? "authenticated" : "unauthenticated");

        // Retrieve user data from local storage if authenticated
        if (isAuthenticated) {
          const storedData = localStorage.getItem("user.profile");
          if (storedData) {
            try {
              const userData = JSON.parse(storedData);
              setSession(userData);
            } catch (error) {
              console.error("Error checking authentication:", error);
              setStatus("unauthenticated");
            }
          }
        }
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

  useEffect(() => {
    if (getSession) {
      localStorage.setItem("user.profile", JSON.stringify(getSession));
    } 
  }, [getSession]);

  return (
    <AuthContext.Provider value={{ status, getSession, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context;
};
