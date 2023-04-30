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
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FileList from "../components/FileList";
import FileUploadManager from "../components/FileUploadManager";
import { AuthContext } from "../context/AuthContext";
import { useContext, useCallback } from "react";
import ProgressMeter from "../components/ProgressMeter";
import { MOCK_CASE_STEPS } from "../mock-data/mockData";

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

function ClientCaseView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, setClientId, setUserType } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = React.useState([]);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientId("");
    setUserType("");
    navigate("/signin");
  };
  console.log(location?.state?.value);
  const fetchData = useCallback(() => {
    axios
      .get(`http://localhost:3001/api/cases/get/${location?.state?.value}`)
      .then((res) => {
        setData(res.data.data.getCase);
        if (res.data.data.getCase.fileIds === undefined) {
          return;
        }

        setFileIds(res.data.data.getCase.fileIds);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location?.state?.value]);

  const determineStep = (status) => {
    switch (status) {
      case "Pre-Intake":
        return 1;
      case "Intake":
        return 2;
      case "Discovery":
        return 3;
      case "Closed":
        return 4;
      case "Archived":
        return 5;
      default:
        return 0;
    }
  };

  const getFiles = useCallback(async () => {
    const fileIds = data.fileIds;
    setFileIds(fileIds);

    const filesInfo = [];
    if (fileIds !== undefined) {
      for (let i = 0; i < fileIds.length; i++) {
        console.log("File " + i + " ID: ", fileIds[i]);
        try {
          const fileRes = await axios.get(
            `http://localhost:3001/api/cases/getFile/${fileIds[i]}`
          );
          console.log(fileRes.data.data.file.filename);
          filesInfo.push({
            _id: fileIds[i],
            filename: fileRes.data.data.file.filename,
          });
        } catch (err) {
          console.log(err);
        }
      }

      setFileNames(filesInfo);
    } else {
      setFileNames([]);
    }
  }, [data.fileIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    getFiles();
  }, [fileIds, getFiles]);

  const handleDownload = async (file) => {
    const response = await axios.get(
      `http://localhost:3001/api/cases/downloadFile/${file._id}/${file.filename}`
    );
    // Convert the hex string to a buffer
    const buffer = Buffer.from(response.data.fileContents.data, "hex");
    // Convert the buffer to a Blob object
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    // Create a link element
    const a = document.createElement("a");
    // Set the href attribute of the link element to the URL for the Blob
    a.href = URL.createObjectURL(blob);
    // Set the download attribute of the link element
    a.download = file.filename;
    // Append the link element to the document
    document.body.appendChild(a);
    // Click the link element to initiate the download
    a.click();
    // Remove the link element from the document
    document.body.removeChild(a);
  };

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
    setFiles([...files, ...addFiles]);
  };

  const handleUploadFiles = () => {
    // Create form data object to send files and metadata to the server
    const formData = new FormData();

    const fileIds = [];

    // Add files to form data object
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i].file);
    }

    var text = "";

    // Upload the files to the server
    axios
      .post("http://localhost:3001/api/cases/uploadFile", formData)
      .then((res) => {
        // Iterate over each file response that was uploaded to the server
        // Add each id to the fileIds array
        for (let i = 0; i < res.data.files.length; i++) {
          console.log("File " + i + " ID: ", res.data.files[i].id);
          fileIds.push(res.data.files[i].id);
        }
        console.log(fileIds);
        // Add the file ids to the case
        axios
          .put(
            `http://localhost:3001/api/cases/fileIds/${location?.state?.value}`,
            {
              fileIds: fileIds,
            }
          )
          .then((res) => {
            console.log(res.data);

            // Part of the reevaluation process
            // We need to parse these new documents and update the case in regards to the value grade, M&M probability, green/red flags and the generative description
            axios
              .post(
                "http://localhost:3001/api/cases/getFileAsPlainText",
                formData
              )
              .then((res) => {
                console.log(res.data);
                text = res.data;
                // Now that we have the text, we need to send it to be used to reevaluate the case and patch it
                axios
                  .post(`http://localhost:3001/api/cases/reevaluateCase`, {
                    text: text,
                    case: data,
                  })
                  .then((res) => {
                    console.log(res.data);
                    // Now that we have the updated case, we need to update the view
                    fetchData();
                  });
              })
              .catch((err) => {
                console.log("FOUND ERROR: " + err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // Clear the files array
    setFiles([]);
  };

  const handleDeleteFile = (index) => {
    // remove the file at the given index from the uploadedFiles array
    const updatedFiles = files.filter((file, i) => i !== index);
    setFiles(updatedFiles);
  };
  return (
    <Box sx={{ display: "flex" }}>
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
          <Button
            variant="contained"
            onClick={() => {
              handleLogout();
            }}
          >
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
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 200,
                  overflow: "auto",
                }}
              >
                <Typography variant="h4">Initial Claim</Typography>
                <Card sx={{ width: "100%", height: "100%", overflow: "auto" }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {data?.initialClaim}
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
                  height: 200,
                  overflow: "auto",
                }}
              >
                <Typography variant="h4">Generative Description</Typography>
                <Card sx={{ width: "100%", height: "100%", overflow: "auto" }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {data?.generatedCaseDescription}
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
                <Typography variant="h4">Case Progress</Typography>
                <Box sx={{ my: 2 }}>
                  <ProgressMeter
                    steps={MOCK_CASE_STEPS}
                    activeStep={determineStep(data?.status)}
                  />
                </Box>
              </Paper>
            </Grid>
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
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" sx={{ mr: 1 }}>
                    Download Files
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    overflow: "auto",
                  }}
                >
                  <FileList files={fileNames} />
                </Box>
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
                      Drag and drop folders/files or click here to select files.
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
                  <Box sx={{ width: "100%", overflow: "auto", maxHeight: 150 }}>
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
                    onClick={() => handleUploadFiles()}
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
  );
}

export default function Dashboard() {
  return <ClientCaseView />;
}
