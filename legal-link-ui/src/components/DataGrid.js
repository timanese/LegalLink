import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const columns = [
  { id: "valueGrade", label: "Grade", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 100 },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "right",
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

export default function DataGrid() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [entries, setEntries] = useState();
  console.log("Entries: ", entries);

  const navigate = useNavigate();
  const handleCellClick = (params, event) => {
    navigate("/attorneyCaseView");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/cases/getAll")
      .then((res) => {
        console.log(res.data);
        setEntries(res.data.data.cases);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entry) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={entry._id}
                    className="MuiDataGrid-cell"
                  >
                    {columns.map((column) => {
                      const value = entry[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          onClick={handleCellClick}
                        >
                          {column.id === "valueGrade" ? (
                            <Box
                              sx={{
                                display: "flex",
                                height: 30,
                                width: 30,
                                bgcolor:
                                  value >= 8
                                    ? "green"
                                    : value >= 6
                                    ? "yellow"
                                    : value >= 4
                                    ? "orange"
                                    : "red",
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="h5" sx={{ color: "white" }}>
                                {value}
                              </Typography>
                            </Box>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
