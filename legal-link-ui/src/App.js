import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AttorneyView from "./components/AttorneyView";
import ClientView from "./components/ClientView";
import { AuthContext } from "./context/AuthContext";
import SignInPage from "./pages/SignInPage";
import ClientDashBoardPage from "./pages/ClientDashboardPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("attorney");
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Routes>
        <Route
          path="/"
<<<<<<< HEAD
          element={isLoggedIn ? <ClientDashBoardPage /> : <SignInPage />}
=======
          element={
            isLoggedIn && userType === "client" ? (
              <ClientView />
            ) : isLoggedIn && userType === "attorney" ? (
              <AttorneyView />
            ) : (
              <SignInPage />
            )
          }
>>>>>>> 9239682b65fd5ad36a29d553e635e5e847a1e8f2
        />
      </Routes>
    </AuthContext.Provider>
  );
}
