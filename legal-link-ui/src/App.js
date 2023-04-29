import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignInPage from "./pages/SignInPage";
import MainPage from "./components/MainPage";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Routes>
        <Route path="/" element={isLoggedIn ? <MainPage /> : <SignInPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
