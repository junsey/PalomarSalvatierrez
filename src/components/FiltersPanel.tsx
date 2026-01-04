import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { ESTADOS, TIPOS } from "../utils/constants";

type Props = {
  search: string;
  selectedEstado: string | null;
  selectedTipo: string | null;
  selectedSexo: string | null;
  onEstadoChange: (value: string | null) => void;
  onTipoChange: (value: string | null) => void;
  onSexoChange: (value: string | null) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

export const FiltersPanel = ({
  search,
  selectedEstado,
  selectedTipo,
  selectedSexo,
  onEstadoChange,
  onTipoChange,
  onSexoChange,
  onSearchChange,
  onClearFilters,
  onRefresh,
  isRefreshing
}: Props) => {
  return (
    <Stack spacing={2}>
      <TextField
        label="Buscar"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        fullWidth
      />
      <Stack
        direction="column"
        spacing={1}
        sx={{ pt: { xs: 0, md: 0.5 } }}
      >
        <Button
          variant="outlined"
          onClick={onClearFilters}
          size="small"
          sx={{ px: 1.5 }}
          fullWidth
        >
          Limpiar filtros
        </Button>
        <Button
          variant="contained"
          onClick={onRefresh}
          disabled={isRefreshing}
          size="small"
          sx={{ px: 1.5 }}
          fullWidth
        >
          Refrescar Excel
        </Button>
      </Stack>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Estado
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {ESTADOS.map((estado) => (
            <Chip
              key={estado}
              label={estado}
              color={selectedEstado === estado ? "primary" : "default"}
              onClick={() =>
                onEstadoChange(selectedEstado === estado ? null : estado)
              }
              variant={selectedEstado === estado ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Tipo
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {TIPOS.map((tipo) => (
            <Chip
              key={tipo}
              label={tipo}
              color={selectedTipo === tipo ? "primary" : "default"}
              onClick={() => onTipoChange(selectedTipo === tipo ? null : tipo)}
              variant={selectedTipo === tipo ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Sexo
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {["Macho", "Hembra"].map((sexo) => (
            <Chip
              key={sexo}
              label={sexo}
              color={selectedSexo === sexo ? "primary" : "default"}
              onClick={() => onSexoChange(selectedSexo === sexo ? null : sexo)}
              variant={selectedSexo === sexo ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>
    </Stack>
  );
};
