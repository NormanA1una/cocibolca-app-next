import { Alert } from "@mui/material";

export default function NoDataSuppliers() {
  return (
    <Alert variant="filled" severity="info" className="mt-4">
      No hay proveedores agregados.
    </Alert>
  );
}
