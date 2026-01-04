import { Box, Typography } from "@mui/material";

export const FieldRow = ({ label, value }: { label: string; value?: string }) => {
  return (
    <Box display="flex" justifyContent="space-between" py={1} borderBottom="1px solid #eee">
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value || "?"}</Typography>
    </Box>
  );
};
