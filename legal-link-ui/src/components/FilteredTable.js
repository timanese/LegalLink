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
  { field: "initialClaim", headerName: "Case Description", width: 600 },
];

export default function FilteredTable() {
  const [rows, setRows] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/cases/getAll")
      .then((res) => {
        setRows(
          res.data.data.cases.map((item, index) => {
            return {
              id: item._id,
              ...item,
            };
          })
        );
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
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          sortModel={[
            {
              field: "valueGrade",
              sort: "desc",
            },
          ]}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
