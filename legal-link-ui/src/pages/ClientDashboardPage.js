import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CaseTable from "../components/Table";
import Button from "@mui/material/Button";
import MessageList from "../components/List";
import MessageInput from "../components/CaseInput";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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
  const { setIsLoggedIn, clientId } = useContext(AuthContext);

  // Grab all mail for a client
  const [mail, setMail] = useState([]);
  useEffect(() => {
    // axios request to get all mail for a client
    axios
      .get(`http://localhost:3001/api/mail/getAllClientMail/${clientId}`)
      .then((res) => {
        setMail(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <Button variant="contained " onClick={() => setIsLoggedIn(false)}>
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

                  <CaseTable
                    rows={[
                      {
                        id: 4,
                        caseName: "Test Case",
                        caseType: "Test Case Type",
                        caseStatus: "Test Case Status",
                      },
                    ]}
                  />
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
                      aria-label="upload files"
                      component="span"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>

                  <MessageList messages={mail} />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                    overflow: "auto",
                  }}
                >
                  <Typography variant="h4">Create a New Case</Typography>

                  <MessageInput />
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