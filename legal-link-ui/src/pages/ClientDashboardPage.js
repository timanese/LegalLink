import "@github/file-attachment-element";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Snackbar } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import axios from "axios";
import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageInput from "../components/CaseInput";
import InputAndUpload from "../components/List";
import CaseTable from "../components/Table";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo-black-no-background.png";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "#2257bf",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const mdTheme = createTheme();

function DashboardContent() {
  const { setIsLoggedIn, setClientId, clientId, setUserType } =
    useContext(AuthContext);
  const navigate = useNavigate();

  // Grab all mail for a client
  const [mail, setMail] = useState([]);
  const [reloadUpdates, setReloadUpdates] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(true);

  // Snackbar
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  function handleSnackbarClose() {
    setIsSnackbarVisible(false);
    setSnackbarMessage("");
  }

  const getUpdates = useCallback(() => {
    // axios request to get all mail for a client
    setUpdateLoading(true);
    axios
      .get(`http://localhost:3001/api/mail/getAllClientMail/${clientId}`)
      .then((res) => {
        setMail(res.data);
        setUpdateLoading(false);
      })
      .catch((err) => {
        setUpdateLoading(false);
        console.log(err);
      });
  }, [clientId]);

  useEffect(() => {
    getUpdates();
  }, [getUpdates]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientId("");
    setUserType("");
    navigate("/signin");
  };

  const handleReloadUpdate = useCallback(() => {
    setReloadUpdates(true);
  }, []);
  useEffect(() => {
    getUpdates();
    setReloadUpdates(false);
  }, [getUpdates, handleReloadUpdate, reloadUpdates]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <Snackbar
          open={isSnackbarVisible}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%", color: "success.main" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <img
                src={logo}
                alt="Logo"
                style={{ height: 50, paddingTop: 4 }}
              />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Client Dashboard
            </Typography>
            <Button variant="contained" onClick={() => handleLogout()}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Ongoing case Table */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <Typography variant="h4">Ongoing Cases</Typography>

                  <CaseTable />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      Updates
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="Refresh updates"
                      component="span"
                      onClick={() => {
                        handleReloadUpdate();
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                  {updateLoading ? (
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <InputAndUpload messages={mail} />
                  )}
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 500,
                    overflow: "auto",
                  }}
                >
                  <Typography variant="h4">Create a New Case</Typography>
                  <MessageInput
                    setIsSnackbarVisible={setIsSnackbarVisible}
                    setSnackbarMessage={setSnackbarMessage}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
