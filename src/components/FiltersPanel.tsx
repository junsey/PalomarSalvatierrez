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
import { getColorClass } from "../utils/colorClasses";

type Props = {
  search: string;
  selectedEstado: string | null;
  selectedTipo: string | null;
  selectedSexo: string | null;
  selectedColor: string | null;
  colors: string[];
  onEstadoChange: (value: string | null) => void;
  onTipoChange: (value: string | null) => void;
  onSexoChange: (value: string | null) => void;
  onColorChange: (value: string | null) => void;
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
  selectedColor,
  colors,
  onEstadoChange,
  onTipoChange,
  onSexoChange,
  onColorChange,
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
              Color
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {colors.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Sin colores
                </Typography>
              )}
              {colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <Box
                    key={color}
                    component="button"
                    type="button"
                    title={color}
                    aria-label={`Filtrar por color ${color}`}
                    onClick={() =>
                      onColorChange(isSelected ? null : color)
                    }
                    className={getColorClass(color)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: isSelected ? "primary.main" : "transparent",
                      cursor: "pointer",
                      padding: 0,
                      outline: "none",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(25, 118, 210, 0.2)"
                        : "none",
                      "&:hover": {
                        transform: "scale(1.05)"
                      },
                      "&:focus-visible": {
                        borderColor: "primary.main",
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.25)"
                      }
                    }}
                  />
                );
              })}
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
