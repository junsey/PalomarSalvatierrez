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
  const [color, setColor] = useState<string | null>(null);

  const normalize = (value?: string) =>
    (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

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
      const matchesColor =
        !color || normalize(p.color) === normalize(color);
      return (
        matchesSearch &&
        matchesEstado &&
        matchesTipo &&
        matchesSexo &&
        matchesColor
      );
    });
  }, [mergedPigeons, search, estado, tipo, sexo, color]);

  const colors = useMemo(() => {
    const map = new Map<string, string>();
    mergedPigeons.forEach((p) => {
      const value = p.color?.trim();
      if (!value) return;
      const key = normalize(value);
      if (!map.has(key)) map.set(key, value);
    });
    return Array.from(map.values()).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );
  }, [mergedPigeons]);

  const totals = useMemo(() => {
    const counts = {
      enPalomar: 0,
      desaparecida: 0,
      fallecida: 0,
      sinPareja: 0
    };
    const normalize = (value?: string) =>
      (value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    mergedPigeons.forEach((p) => {
      const estadoValue = normalize(p.estado);
      if (estadoValue === "en palomar") counts.enPalomar += 1;
      if (estadoValue === "desaparecido" || estadoValue === "desaparecida") {
        counts.desaparecida += 1;
      }
      if (estadoValue === "fallecido" || estadoValue === "fallecida") {
        counts.fallecida += 1;
      }
      if (!p.pareja || !p.pareja.trim()) counts.sinPareja += 1;
    });
    return counts;
  }, [mergedPigeons]);

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
            selectedColor={color}
            colors={colors}
            onEstadoChange={setEstado}
            onTipoChange={setTipo}
            onSexoChange={setSexo}
            onColorChange={setColor}
            onSearchChange={setSearch}
            onClearFilters={() => {
              setSearch("");
              setEstado(null);
              setTipo(null);
              setSexo(null);
              setColor(null);
            }}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            summary={
              <Box
                p={2}
                bgcolor="background.paper"
                borderRadius={2}
                boxShadow="0 6px 16px rgba(0,0,0,0.06)"
              >
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Resumen
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    En palomar: {totals.enPalomar}
                  </Typography>
                  <Typography variant="body2">
                    Desaparecidas: {totals.desaparecida}
                  </Typography>
                  <Typography variant="body2">
                    Fallecidas: {totals.fallecida}
                  </Typography>
                  <Typography variant="body2">
                    Sin pareja: {totals.sinPareja}
                  </Typography>
                </Stack>
              </Box>
            }
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
