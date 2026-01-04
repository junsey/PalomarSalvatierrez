import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
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
  summary?: React.ReactNode;
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
  isRefreshing,
  summary
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <Box>
      {isMobile && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography
            variant="subtitle1"
            fontWeight={800}
            sx={{ color: "primary.main" }}
          >
            Filtros de busqueda
          </Typography>
          <IconButton onClick={toggle} aria-label="Toggle filtros">
            {open ? <CloseIcon /> : <FilterListIcon />}
          </IconButton>
        </Box>
      )}
      <Collapse in={open} unmountOnExit={isMobile}>
        <Stack spacing={2}>
          {!isMobile && (
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                sx={{ color: "primary.main" }}
              >
                Filtros de busqueda
              </Typography>
              <Box
                sx={{
                  height: 3,
                  width: 48,
                  bgcolor: "primary.main",
                  borderRadius: 999,
                  mt: 0.5
                }}
              />
            </Box>
          )}
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
          {summary}
        </Stack>
      </Collapse>
    </Box>
  );
};
