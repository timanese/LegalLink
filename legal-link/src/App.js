import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";

export default function App() {
  const isLoggedIn = true; // Change this to check if the user is logged in
  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <MainPage /> : <LoginPage />} />
    </Routes>
  );
}
