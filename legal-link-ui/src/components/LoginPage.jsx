import { Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { setIsLoggedIn } = useContext(AuthContext);
  function handleLogin() {
    setIsLoggedIn(true);
  }
  return (
    <div>
      <h1>Login Page</h1>
      <Button variant="contained" onClick={() => handleLogin()}>
        Login
      </Button>
    </div>
  );
}
