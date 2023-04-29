import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Card } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import CardList from "../components/CardList";
import CircularGauge from "../components/CircularGauge";
import FileList from "../components/FileList";
import CardContent from "@mui/material/CardContent";
import MessageModal from "../components/MessageModal";
import { useState } from "react";

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

function AttorneyCaseView() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const files = [
    {
      id: 1,
      name: "Document 1",
      url: "https://example.com/document1.pdf",
    },
    {
      id: 2,
      name: "Document 2",
      url: "https://example.com/document2.pdf",
    },
    {
      id: 3,
      name: "Document 3",
      url: "https://example.com/document3.pdf",
    },
    {
      id: 4,
      name: "Document 3",
      url: "https://example.com/document3.pdf",
    },
    {
      id: 5,
      name: "Document 3",
      url: "https://example.com/document3.pdf",
    },
    {
      id: 6,
      name: "Document 3",
      url: "https://example.com/document3.pdf",
    },
    {
      id: 7,
      name: "Document 3",
      url: "https://example.com/document3.pdf",
    },
  ];
  console.log(openModal);

  return (
    <ThemeProvider theme={mdTheme}>
      {openModal ? <MessageModal /> : <></>}

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
              <IconButton
                color="black"
                aria-label="upload files"
                component="span"
                onClick={() => {
                  navigate("/attorneyDashBoard");
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              Case View
            </Typography>
            <Button
              variant="contained "
              onClick={() => {
                console.log("djfkdslj");
                setOpenModal(true);
              }}
            >
              Send Message to Client
            </Button>

            <Button variant="contained ">Log Out</Button>
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
                    height: 430,
                    overflow: "auto",
                  }}
                >
                  <Typography variant="h4">Case Description</Typography>
                  <Card
                    sx={{ width: "100%", height: "100%", overflow: "auto" }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        kdljdkjfks
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum. Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis
                        aute irure dolor in reprehenderit in voluptate velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur
                        sint occaecat cupidatat non proident, sunt in culpa qui
                        officia deserunt mollit anim id est laborum. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                      </Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 300,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      Grade
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="upload files"
                      component="span"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularGauge value={20} />
                  </Box>
                </Paper>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 100,
                    mt: 4,
                  }}
                >
                  <Typography variant="h4" sx={{ mr: 1 }}>
                    Accept/Decline
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <ButtonGroup
                      disableElevation
                      variant="contained"
                      aria-label="Disabled elevation buttons"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <Button>Accept</Button>
                      <Button>Decline</Button>
                    </ButtonGroup>
                  </Box>
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
                  <Typography variant="h4">Grading Breakdown</Typography>
                  <CardList />
                </Paper>
              </Grid>
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
                  <Typography variant="h4">Related Documentation</Typography>
                  <Box sx={{ overflow: "auto" }}>
                    <FileList files={files} />
                  </Box>
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
  return <AttorneyCaseView />;
}
