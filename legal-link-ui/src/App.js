import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AttorneyView from "./components/AttorneyView";
import ClientView from "./components/ClientView";
import { AuthContext } from "./context/AuthContext";
import SignInPage from "./pages/SignInPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("attorney");
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn && userType === "client" ? (
              <ClientView />
            ) : isLoggedIn && userType === "attorney" ? (
              <AttorneyView />
            ) : (
              <SignInPage />
            )
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}
