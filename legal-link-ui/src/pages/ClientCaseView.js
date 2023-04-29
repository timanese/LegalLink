import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Card } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
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
import FileUploadManager from "../components/FileUploadManager";
import MessageList from "../components/List";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProgressMeter from "../components/ProgressMeter";
import { MOCK_CASE_STEPS } from "../mock-data/mockData";

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

function ClientCaseView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);

  // location.state.value
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/cases/get/${location.state.value}`)
      .then((res) => {
        setData(res.data.data.getCase);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state.value]);

  const [files, setFiles] = React.useState([]);

  const handleChange = (event) => {
    console.log(...event.target.files);
    event.preventDefault();

    const addFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const Attachment = {
        file: event.target.files[i],
      };
      addFiles.push(Attachment);
    }

    if (event.target.files.length === 0) {
      return;
    }
    console.log(addFiles);
    setFiles([...files, ...addFiles]);
  };

  const handleDeleteFile = (index) => {
    // remove the file at the given index from the uploadedFiles array
    const updatedFiles = files.filter((file, i) => i !== index);
    setFiles(updatedFiles);
  };
  console.log(data);
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar>
            <IconButton
              color="black"
              aria-label="upload files"
              component="span"
              onClick={() => {
                navigate("/clientDashBoard");
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {data?.title} STATUS: {data?.status}
            </Typography>
            <Button variant="contained" onClick={() => {}}>
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
                  <Typography variant="h4">Description</Typography>
                  <Card
                    sx={{ width: "100%", height: "100%", overflow: "auto" }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {data?.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data?.description}
                      </Typography>
                    </CardContent>
                  </Card>
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
                  <Typography variant="h4">Next Steps</Typography>
                  <ProgressMeter steps={MOCK_CASE_STEPS} />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      Download Files
                    </Typography>
                    <MessageList messages={data?.fileIds}></MessageList>
                    <Button variant="contained " onClick={() => {}}>
                      Download
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  ></Box>
                </Paper>
              </Grid>
              {/* Ongoing case Table */}

              <Grid item xs={12} md={8} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <Typography variant="h4">Upload Files</Typography>

                  <Box
                    className="file-attachment"
                    sx={{
                      height: "25%",
                      overflow: "auto",
                      backgroundColor: "grey.200",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      my: 1,
                      borderRadius: 1,
                    }}
                  >
                    <file-attachment
                      className="GitHubFileAttach"
                      input="file"
                      directory
                    >
                      <Box
                        className="file-attachment-text"
                        sx={{ color: "grey.700", marginBottom: 1 }}
                      >
                        Drag and drop folders/files or click here to select
                        files.
                      </Box>
                      <input
                        className="inputUploadFiles"
                        type="file"
                        onChange={handleChange}
                        multiple
                        sx={{ display: "none" }}
                      />
                    </file-attachment>
                  </Box>
                  {/* File Upload */}
                  {files.length > 0 && (
                    <Box
                      sx={{ width: "100%", overflow: "auto", maxHeight: 150 }}
                    >
                      <FileUploadManager
                        files={files}
                        handleDeleteFile={handleDeleteFile}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      py: 2,
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {}}
                      sx={{ height: 40, alignSelf: "flex-end" }}
                    >
                      Upload
                    </Button>
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
  return <ClientCaseView />;
}
