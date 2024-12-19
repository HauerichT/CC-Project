import { DataGrid } from '@mui/x-data-grid';
import { Box } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={[
          { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
          { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
          { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
        ]}
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          {
            field: "firstName",
            headerName: "First name",
            width: 150,
            editable: true,
          },
          {
            field: "lastName",
            headerName: "Last name",
            width: 150,
            editable: true,
          },
          {
            field: "age",
            headerName: "Age",
            type: "number",
            width: 110,
            editable: true,
          },
          {
            field: "fullName",
            headerName: "Full name",
            description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 160,
            valueGetter: (_value, row) =>
              `${row.firstName || ""} ${row.lastName || ""}`,
          },
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}