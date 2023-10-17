import { Alert } from "@mui/material";

export default function NoDataSuppliers({ text }: { text: string }) {
  return (
    <Alert variant="filled" severity="info" className="mt-4">
      {`No hay ${text} agregados.`}
    </Alert>
  );
}
