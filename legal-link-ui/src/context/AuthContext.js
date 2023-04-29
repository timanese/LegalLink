import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  clientId: "",
  userType: "",
  setIsLoggedIn: () => {},
  setClientId: () => {},
  setUserType: () => {},
});
