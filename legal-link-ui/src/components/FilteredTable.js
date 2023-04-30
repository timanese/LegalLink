import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    field: "valueGrade",
    headerName: "Grade",
    width: 130,
    sortable: true,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          height: 30,
          width: 30,
          bgcolor:
            params.value >= 8
              ? "green"
              : params.value >= 6
              ? "orange"
              : params.value >= 4
              ? "orange"
              : "red",
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "white" }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  { field: "clientName", headerName: "Name", width: 130 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "initialClaim", headerName: "Case Description", width: 800 },
  {
    field: "createdAt",
    headerName: "Created Date",
    width: 600,
    renderCell: (params) => <Typography>{formatDate(params.value)}</Typography>,
  },
];

function formatDate(unformattedDate) {
  const date = new Date(unformattedDate);
  const dateString = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
  const timeString = date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDateTime = `${dateString} ${timeString}`;
  return formattedDateTime;
}

export default function FilteredTable() {
  const [rows, setRows] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/cases/getAll")
      .then((res) => {
        let fetchedRows = res.data.data.cases.map((item, index) => {
          return {
            id: item._id,
            ...item,
          };
        });

        // Sort the fetched rows by valueGrade descending
        fetchedRows.sort((a, b) => b.valueGrade - a.valueGrade);
        setRows(fetchedRows);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div style={{ height: 800, width: "100%" }}>
      {rows ? (
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={(params) =>
            navigate("/attorneyCaseView", {
              state: { value: params.row, id: params._id },
            })
          }
          checkboxSelection
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[5]}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
