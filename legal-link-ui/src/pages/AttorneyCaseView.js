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
  const { setIsLoggedIn, setClientId, setUserType } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  // const [files, setFiles] = React.useState([]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientId("");
    setUserType("");
    navigate("/signin");
  };

  const handleAccept = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3001/api/cases/acceptCase/${data._id}`
      )
      .then((res) => {
        console.log(res.data);
        // Send mail to client notifying them that their case has been accepted
        axios
          .post("http://localhost:3001/api/mail/sendMail", {
            caseId: data._id,
            clientId: data.clientID,
            title: "Case Advanced",
            description: "Your case has been approved and moved forward by an attorney.",
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

  const handleReject = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3001/api/cases/rejectCase/${data._id}`
      );
      console.log(res.data);
      navigate("/attorneyDashBoard");
    } catch (err) {
      console.log(err);
    }
  };

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const caseRes = await axios.get(`http://localhost:3001/api/cases/get/${location?.state?.value}`);
//       const caseData = caseRes.data.data.getCase;
//       console.log(caseData);
//       setData(caseData);

//       const fileIds = caseData.fileIds;
//       setFileIds(fileIds);

//       const filesInfo = [];

//       for (let i = 0; i < fileIds.length; i++) {
//         console.log("File " + i + " ID: ", fileIds[i]);
//         try {
//           const fileRes = await axios.get(`http://localhost:3001/api/cases/getFile/${fileIds[i]}`);
//           console.log(fileRes.data);
//           filesInfo.push({ _id: fileIds[i], filename: fileRes.data.fileName });
//         } catch (err) {
//           console.log(err);
//         }
//       }

//       setFileNames(filesInfo);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   fetchData();
// }, [location?.state?.value]);

  const handleDownload = async(file) => {
    const response = await axios.get(`http://localhost:3001/downloadFile/${file._id}/${file.filename}`);
    // Convert the hex string to a buffer
    const buffer = Buffer.from(response.data.fileContents.data, 'hex')
    // Convert the buffer to a Blob object
    const blob = new Blob([buffer], {type: 'application/octet-stream'});
    // Create a link element
    const a = document.createElement('a');
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
}


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

  const location = useLocation();
  const { rowData } = location.state;
  console.log("Row data: ", rowData);

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
                        {rowData.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rowData.description}
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
                    <CircularGauge value={rowData.valueGrade * 10} />
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
                  <CardList rowData={rowData} />
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
