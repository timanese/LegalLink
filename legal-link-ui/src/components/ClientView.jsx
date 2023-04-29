import { Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ClientView() {
  const { setIsLoggedIn } = useContext(AuthContext);
  return (
    <div>
      <h1>Client View</h1>
      <Button variant="contained" onClick={() => setIsLoggedIn(false)}>
        Logout
      </Button>
    </div>
  );
}
