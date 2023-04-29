import { Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MainPage() {
  const { setIsLoggedIn } = useContext(AuthContext);
  return (
    <div>
      <h1>Main Page</h1>
      <Button variant="contained" onClick={() => setIsLoggedIn(false)}>
        Logout
      </Button>
    </div>
  );
}
