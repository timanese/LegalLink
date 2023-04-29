import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  clientId: "",
  setIsLoggedIn: () => {},
  setClientId: () => {},
});
