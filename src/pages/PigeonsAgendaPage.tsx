import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { usePigeonsQuery } from "../data/pigeonsQuery";
import { usePigeonsStore } from "../app/pigeonsStore";
import { getLocalFotos } from "../utils/localPhotos";
import { getInitial, stringToColor } from "../utils/avatar";
import { formatAgendaDate, parseDate, toDateKey } from "../utils/date";

type AgendaMode = "llegada" | "nacimiento";

export const PigeonsAgendaPage = () => {
  const { data, isLoading, isError } = usePigeonsQuery();
  const { localPigeons } = usePigeonsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode =
    searchParams.get("modo") === "nacimiento" ? "nacimiento" : "llegada";
  const [mode, setMode] = useState<AgendaMode>(initialMode);
  const focusDate = searchParams.get("fecha");
  const initialYear = searchParams.get("anio") || "todos";
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);

  const merged = useMemo(() => {
    const sheet = data || [];
    const map = new Map<string, typeof sheet[0]>();
    sheet.forEach((p) => map.set(p.numero.toLowerCase(), p));
    localPigeons.forEach((p) => map.set(p.numero.toLowerCase(), p));
    return Array.from(map.values());
  }, [data, localPigeons]);

  const grouped = useMemo(() => {
    const entries = merged
      .map((p) => {
        const raw =
          mode === "llegada" ? p.fechaLlegada : p.fechaNacimiento;
        const date = parseDate(raw);
        if (!date) return null;
        return { pigeon: p, date, key: toDateKey(date) };
      })
      .filter(Boolean) as { pigeon: (typeof merged)[number]; date: Date; key: string }[];

    const map = new Map<string, typeof entries>();
    entries.forEach((entry) => {
      const list = map.get(entry.key) ?? [];
      list.push(entry);
      map.set(entry.key, list);
    });

    return Array.from(map.entries())
      .map(([key, items]) => ({
        key,
        date: items[0].date,
        items
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [merged, mode]);

  const years = useMemo(() => {
    const set = new Set<number>();
    grouped.forEach((group) => set.add(group.date.getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [grouped]);

  const filteredGroups = useMemo(() => {
    if (selectedYear === "todos") return grouped;
    const year = Number(selectedYear);
    return grouped.filter((group) => group.date.getFullYear() === year);
  }, [grouped, selectedYear]);

  const handleModeChange = (_: MouseEvent<HTMLElement>, value: AgendaMode | null) => {
    if (!value) return;
    setMode(value);
    const next = new URLSearchParams(searchParams);
    next.set("modo", value);
    setSearchParams(next);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    const next = new URLSearchParams(searchParams);
    if (year === "todos") {
      next.delete("anio");
    } else {
      next.set("anio", year);
    }
    setSearchParams(next);
  };

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography>Cargando agenda...</Typography>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  if (isError) {
    return <Alert severity="error">No se pudo cargar la agenda.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Button component={Link} to="/palomas" startIcon={<ArrowBack />}>
            Volver
          </Button>
          <Typography variant="h5">Calendario</Typography>
        </Box>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "flex-end" }
          }}
        >
          <ToggleButton value="llegada">Fecha de llegada</ToggleButton>
          <ToggleButton value="nacimiento">Fecha de nacimiento</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {filteredGroups.length === 0 && (
        <Alert severity="info">No hay fechas registradas para mostrar.</Alert>
      )}

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
        <Box sx={{ width: { xs: "100%", md: 220 } }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Anios
          </Typography>
          <Stack
            direction={{ xs: "row", md: "column" }}
            spacing={1}
            sx={{
              flexWrap: { xs: "nowrap", md: "wrap" },
              overflowX: { xs: "auto", md: "visible" },
              pb: { xs: 1, md: 0 }
            }}
          >
            <Button
              variant={selectedYear === "todos" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleYearChange("todos")}
              sx={{ flexShrink: 0 }}
            >
              Todos
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === String(year) ? "contained" : "outlined"}
                size="small"
                onClick={() => handleYearChange(String(year))}
                sx={{ flexShrink: 0 }}
              >
                {year}
              </Button>
            ))}
          </Stack>
        </Box>
        <Stack spacing={3} flex={1} minWidth={0}>

          {filteredGroups.map((group, index) => {
            const isFocused = focusDate === group.key;
            const year = group.date.getFullYear();
            const prevYear =
              index === 0 ? null : filteredGroups[index - 1].date.getFullYear();
            return (
              <Box key={group.key}>
                {prevYear !== year && (
                  <Box mb={1}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {year}
                    </Typography>
                    <Divider />
                  </Box>
                )}
                <Box
                  sx={{
                    borderLeft: "4px solid",
                    borderColor: isFocused ? "primary.main" : "grey.300",
                    pl: 2,
                    py: 1,
                    bgcolor: isFocused ? "action.hover" : "transparent",
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {formatAgendaDate(group.date)}
                  </Typography>
                  <Stack spacing={1}>
                    {group.items.map(({ pigeon }) => {
                      const local = getLocalFotos(pigeon.nombre);
                      const foto = pigeon.foto || local[0];
                      const initial = getInitial(pigeon.nombre);
                      return (
                        <Card key={pigeon.numero} variant="outlined">
                          <CardContent
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              py: 1.5,
                              "&:last-child": { pb: 1.5 }
                            }}
                          >
                            {foto ? (
                              <Avatar
                                src={foto}
                                alt={pigeon.nombre}
                                sx={{ width: 44, height: 44 }}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  width: 44,
                                  height: 44,
                                  bgcolor: stringToColor(pigeon.nombre)
                                }}
                              >
                                {initial}
                              </Avatar>
                            )}
                            <Box>
                              <Box
                                component={Link}
                                to={`/palomas/${encodeURIComponent(pigeon.numero)}`}
                                sx={{
                                  textDecoration: "none",
                                  color: "inherit"
                                }}
                              >
                                <Typography fontWeight={700}>
                                  {pigeon.nombre}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                #{pigeon.numero}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
};
