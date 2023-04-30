import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardList from "../components/CardList";
import CircularGauge from "../components/CircularGauge";
import FileList from "../components/FileList";
import MessageModal from "../components/MessageModal";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import FileUploadManager from "../components/FileUploadManager";
import { useEffect } from "react";

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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { setIsLoggedIn, clientId, setClientId, setUserType } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = useState([]);
  const location = useLocation();

  const rowData = location?.state?.value;

  console.log(rowData.id);

  // const [files, setFiles] = React.useState([]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientId("");
    setUserType("");
    navigate("/signin");
  };

  const handleAccept = async () => {
    try {
      const res = await axios
        .patch(
          `http://localhost:3001/api/cases/acceptCase/${rowData._id}`
        )
        .then((res) => {
          console.log(res.data);
          // Send mail to client notifying them that their case has been accepted
          axios
            .post("http://localhost:3001/api/mail/send", {
              caseId: rowData.id,
              clientId: clientId,
              title: "Case Advanced",
              description:
                "Your case has been approved and moved forward by an attorney.",
            })
            .then((res) => {
              console.log(res.data);
              navigate("/attorneyDashBoard");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
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

  const handleReject = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3001/api/cases/rejectCase/${rowData.id}`
      );
      console.log(res.data);
      navigate("/attorneyDashBoard");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const caseRes = await axios.get(
          `http://localhost:3001/api/cases/get/${rowData.id}`
        );
        const caseData = caseRes.data.data.getCase;
        console.log(caseData);
        setData(caseData);

        const fileIds = caseData.fileIds;
        setFileIds(fileIds);

        const filesInfo = [];

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
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [location?.state?.value]);

  const handleDownload = async (file) => {
    const response = await axios.get(
      `http://localhost:3001/downloadFile/${file._id}/${file.filename}`
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



  // useEffect (() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(`http://localhost:3001/api/cases/get/${rowData.id}`);
  //       console.log(res.data.data.getCase);
  //       setData(res.data.data.getCase);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   fetchData();
  // }, [rowData.id]);


  const handleUploadFiles = () => {
    // Create form data object to send files and metadata to the server
    const formData = new FormData();

    const fileIds = [];

    // Add files to form data object
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i].file);
    }

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
          .put(`http://localhost:3001/api/cases/fileIds/${data._id}`, {
            fileIds: fileIds,
          })
          .then((res) => {
            console.log(res.data);
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
    <ThemeProvider theme={mdTheme}>
      <MessageModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
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
                setIsOpenModal(true);
              }}
            >
              Send Message to Client
            </Button>

            <Button variant="contained " onClick={handleLogout}>
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
                        Client Name: {rowData?.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Initial Claim: {data.initialClaim}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Generative Description: {data.generatedCaseDescription}
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
                    height: 250,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      Grade
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularGauge value={rowData?.valueGrade * 10} />
                  </Box>
                </Paper>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 150,
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
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ mr: 2 }}
                      onClick={() => handleAccept()}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      onClick={() => handleReject()}
                    >
                      Decline
                    </Button>
                  </Box>
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
                  <Typography variant="h4">Grading Breakdown</Typography>
                  <CardList rowData={rowData} />
                </Paper>
              </Grid>
              <Grid item xs={6}>
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
                    <FileList files={fileNames} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={6}>
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
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <AttorneyCaseView />;
}
