import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from "../assets/logo-no-background.png";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const theme = createTheme();

export default function SignUpPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    // Send a POST request to the API endpoint to create a new user
    axios.post("http://localhost:3001/api/clients/register", {
      name: data.get("first name") + " " + data.get("last name"),
      email: data.get("email"),
      password: data.get("password"),
    })
    .then((res) => {
      console.log(res);
      navigate("/signin");
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            style={{ height: 100, width: 300, marginBottom: 30 }}
            alt="LegalLink Logo"
          />
          <Avatar sx={{ m: 1, bgcolor: "#2257bf" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="first name"
              label="First Name"
              type="text"
              id="first name"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="last name"
              label="Last Name"
              type="text"
              id="last name"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                User Type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="attorney"
                  control={<Radio />}
                  label="Attorney"
                />
                <FormControlLabel
                  value="client"
                  control={<Radio />}
                  label="Client"
                />
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
