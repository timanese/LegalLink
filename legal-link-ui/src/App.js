import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ClientDashBoardPage from "./pages/ClientDashboardPage";
import AttorneyDashBoardPage from "./pages/AttorneyDashBoardPage";
import AttorneyCaseView from "./pages/AttorneyCaseView";
import ClientCaseView from "./pages/ClientCaseView";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientId, setClientId] = useState(""); // TODO: Change to [userType, setUserType
  const [userType, setUserType] = useState("");
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        clientId,
        setIsLoggedIn,
        setClientId,
        userType,
        setUserType,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn && userType === "client" ? (
              navigate("/clientDashBoard")
            ) : isLoggedIn && userType === "attorney" ? (
              navigate("/attorneyDashBoard")
            ) : (
              <SignInPage />
            )
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/attorneyCaseView" element={<AttorneyCaseView />} />
        <Route path="/attorneyDashBoard" element={<AttorneyDashBoardPage />} />
        <Route path="/clientDashBoard" element={<ClientDashBoardPage />} />
        <Route path="/clientCaseView" element={<ClientCaseView />} />
      </Routes>
    </AuthContext.Provider>
  );
}
