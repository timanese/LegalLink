import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AttorneyView from "./components/AttorneyView";
import ClientView from "./components/ClientView";
import { AuthContext } from "./context/AuthContext";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ClientDashBoardPage from "./pages/ClientDashboardPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("client");
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn && userType === "client" ? (
              <ClientDashBoardPage />
            ) : isLoggedIn && userType === "attorney" ? (
              <AttorneyView />
            ) : (
              <SignInPage />
            )
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
