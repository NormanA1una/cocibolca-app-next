import { Box, CircularProgress } from "@mui/material";

export default function LoginSkeleton() {
  return (
    <Box className="min-h-screen flex items-center justify-center container mx-auto">
      <CircularProgress />
    </Box>
  );
}
