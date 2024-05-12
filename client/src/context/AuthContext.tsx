"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";

import Cookies from "js-cookie";
import { UserType } from "@/shared/types";
import useAuthStore from "@/store/useAuth";

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
  const { setSession: setUser } = useAuthStore();
  const auth_token = Cookies.get("-secure-node-authToken");
  const [status, setStatus] = useState<AuthStatus>("pending");
  const [getSession, setSession] = useState<UserType | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = auth_token ? true : false;

        setStatus(isAuthenticated ? "authenticated" : "unauthenticated");

        // Retrieve user data from local storage if authenticated
        if (isAuthenticated) {
          const storedData = localStorage.getItem("user.profile");
          if (storedData) {
            try {
              const userData = JSON.parse(storedData);
              setSession(userData);
              setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                profile: userData.profile,
                confirmToken: userData.confirmToken,
              });
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
  }, [auth_token, setUser]);

  useEffect(() => {
    if (getSession) {
      localStorage.setItem("user.profile", JSON.stringify(getSession));
      setUser({
        id: getSession.id,
        name: getSession.name,
        email: getSession.email,
        username: getSession.username,
        profile: getSession.profile,
        confirmToken: getSession.confirmToken,
      });
    }
  }, [getSession, setUser]);

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
