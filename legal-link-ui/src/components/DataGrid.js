import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import { TextField } from "@mui/material";

export default function FilterableDataGrid() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 100,
    maxColumns: 6,
  });

  const [filterModel, setFilterModel] = React.useState({
    items: [{ columnField: "commodity", operatorValue: "contains", value: "" }],
  });

  const handleFilterChange = (model) => {
    setFilterModel(model);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data.rows}
        columns={data.columns}
        filterModel={filterModel}
        onFilterModelChange={handleFilterChange}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            filters: (
              <TextField
                variant="standard"
                value={filterModel.items[0].value}
                onChange={(event) => {
                  const value = event.target.value;
                  setFilterModel((oldModel) => {
                    const newModel = { ...oldModel };
                    newModel.items[0] = {
                      ...oldModel.items[0],
                      value,
                    };
                    return newModel;
                  });
                }}
                placeholder="Filter by commodity"
                size="small"
              />
            ),
          },
        }}
      />
    </div>
  );
}
