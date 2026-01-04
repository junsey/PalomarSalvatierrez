import {
  Alert,
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";
import { usePigeonsQuery } from "../data/pigeonsQuery";
import { PigeonCard } from "../components/PigeonCard";
import { FiltersPanel } from "../components/FiltersPanel";
import { usePigeonsStore } from "../app/pigeonsStore";
import { Pigeon } from "../types/pigeon";

export const PigeonsListPage = () => {
  const { data, isLoading, isError, isFetching, refetch } = usePigeonsQuery();
  const { localPigeons } = usePigeonsStore();
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);

  const mergedPigeons = useMemo(() => {
    const sheet = data || [];
    const map = new Map<string, Pigeon>();
    sheet.forEach((p) => map.set(p.numero.toLowerCase(), p));
    localPigeons.forEach((p) => map.set(p.numero.toLowerCase(), p));
    return Array.from(map.values());
  }, [data, localPigeons]);

  const filtered = useMemo(() => {
    return mergedPigeons.filter((p) => {
      const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
      const matchesEstado = !estado || p.estado === estado;
      const matchesTipo = !tipo || p.tipo === tipo;
      const matchesSexo = !sexo || p.sexo === sexo;
      return matchesSearch && matchesEstado && matchesTipo && matchesSexo;
    });
  }, [mergedPigeons, search, estado, tipo, sexo]);

  return (
    <Stack spacing={3}>
      <Grid
        container
        columnSpacing={{ xs: 0, md: 3 }}
        rowSpacing={{ xs: 3, md: 3 }}
        sx={{ mx: 0 }}
      >
        <Grid item xs={12} md={3} order={{ xs: 1, md: 1 }}>
          <FiltersPanel
            search={search}
            selectedEstado={estado}
            selectedTipo={tipo}
            selectedSexo={sexo}
            onEstadoChange={setEstado}
            onTipoChange={setTipo}
            onSexoChange={setSexo}
            onSearchChange={setSearch}
            onClearFilters={() => {
              setSearch("");
              setEstado(null);
              setTipo(null);
              setSexo(null);
            }}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
          />
        </Grid>
        <Grid item xs={12} md={9} order={{ xs: 2, md: 2 }}>
          {isLoading && (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={120} />
              <Skeleton variant="rounded" height={120} />
              <Skeleton variant="rounded" height={120} />
            </Stack>
          )}
          {isError && <Alert severity="error">No se pudo cargar la sheet.</Alert>}

          {!isLoading && !isError && filtered.length === 0 && (
            <Box py={4} textAlign="center">
              <Typography variant="h6">Sin resultados</Typography>
              <Typography color="text.secondary">
                Ajusta los filtros o agrega una paloma.
              </Typography>
            </Box>
          )}

          <Grid
            container
            columnSpacing={{ xs: 0, md: 2 }}
            rowSpacing={{ xs: 2, md: 2 }}
            sx={{ mx: 0 }}
          >
            {filtered.map((p) => (
              <Grid key={p.numero} item xs={12} sm={12} md={6} lg={4}>
                <PigeonCard pigeon={p} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};
