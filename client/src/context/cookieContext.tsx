"use client";

import { CookiesProvider } from "react-cookie";

interface CookieContextProps {
  children: React.ReactNode;
}

const CookieContext: React.FC<CookieContextProps> = ({ children }) => {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      {children}
    </CookiesProvider>
  );
};

export default CookieContext;
