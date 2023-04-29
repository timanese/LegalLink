import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ClientDashBoardPage from "./pages/ClientDashboardPage";
import AttorneyDashBoardPage from "./pages/AttorneyDashBoardPage";
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
              <ClientDashBoardPage />
            ) : isLoggedIn && userType === "attorney" ? (
              <AttorneyDashBoardPage />
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
