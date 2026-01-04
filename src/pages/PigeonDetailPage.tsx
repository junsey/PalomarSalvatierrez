import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import PhotoOutlined from "@mui/icons-material/PhotoOutlined";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { usePigeonsQuery } from "../data/pigeonsQuery";
import { usePigeonsStore } from "../app/pigeonsStore";
import { FieldRow } from "../components/FieldRow";
import { resolvePigeonRef } from "../utils/resolvePigeonRef";
import { FIELD_LABELS } from "../utils/constants";
import { getLocalFotos } from "../utils/localPhotos";
import { getInitial, stringToColor } from "../utils/avatar";
import { parseDate, toDateKey } from "../utils/date";

export const PigeonDetailPage = () => {
  const { numero } = useParams();
  const { data, isLoading, isError } = usePigeonsQuery();
  const { localPigeons } = usePigeonsStore();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const merged = useMemo(() => {
    const sheet = data || [];
    const map = new Map<string, typeof sheet[0]>();
    sheet.forEach((p) => map.set(p.numero.toLowerCase(), p));
    localPigeons.forEach((p) => map.set(p.numero.toLowerCase(), p));
    return Array.from(map.values());
  }, [data, localPigeons]);

  const pigeon = merged.find(
    (p) => p.numero.toLowerCase() === (numero || "").toLowerCase()
  );

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={180} />
        <Skeleton variant="rounded" height={300} />
      </Stack>
    );
  }

  if (isError || !pigeon) {
    return <Alert severity="error">Paloma no encontrada.</Alert>;
  }

  const padreRef = resolvePigeonRef(pigeon.padre, merged);
  const madreRef = resolvePigeonRef(pigeon.madre, merged);
  const parejaRef = resolvePigeonRef(pigeon.pareja, merged);
  const localFotos = getLocalFotos(pigeon.nombre);
  const fotos = Array.from(
    new Set([pigeon.foto, ...localFotos].filter(Boolean) as string[])
  );
  const descripcion = pigeon.descripcion?.trim();
  const lightboxSrc =
    lightboxIndex !== null ? fotos[lightboxIndex] : null;
  const buildAgendaLink = (mode: "llegada" | "nacimiento", value?: string) => {
    const date = parseDate(value);
    if (!date) return null;
    const key = toDateKey(date);
    return `/palomas/calendario?modo=${mode}&fecha=${encodeURIComponent(key)}`;
  };

  const renderDateRow = (
    label: string,
    value: string | undefined,
    mode: "llegada" | "nacimiento"
  ) => {
    const link = buildAgendaLink(mode, value);
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        py={1}
        borderBottom="1px solid #eee"
      >
        <Typography color="text.secondary">{label}</Typography>
        {link ? (
          <Chip
            component={Link}
            to={link}
            label={value}
            size="small"
            variant="outlined"
            clickable
            sx={{ textDecoration: "none" }}
          />
        ) : (
          <Typography>{value || "?"}</Typography>
        )}
      </Box>
    );
  };

  const renderRelation = (
    label: string,
    relation: typeof merged[number] | null | undefined,
    fallback?: string
  ) => {
    const displayName = relation?.nombre || fallback;
    const local = relation ? getLocalFotos(relation.nombre) : [];
    const foto = relation?.foto || local[0];
    const initial = getInitial(displayName);
    const content = (
      <>
        {foto ? (
          <Avatar
            src={foto}
            alt={displayName || "Paloma"}
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: stringToColor(displayName || "paloma")
            }}
          >
            {initial}
          </Avatar>
        )}
        <Typography>{displayName || "?"}</Typography>
      </>
    );
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={1}
        borderBottom="1px solid #eee"
      >
        <Typography color="text.secondary">{label}</Typography>
        {relation ? (
          <Box
            component={Link}
            to={`/palomas/${encodeURIComponent(relation.numero)}`}
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            {content}
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            {content}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Button component={Link} to="/" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Volver a la home
      </Button>
      <Grid
        container
        columnSpacing={{ xs: 0, md: 3 }}
        rowSpacing={{ xs: 3, md: 3 }}
        sx={{ mx: 0 }}
      >
        <Grid item xs={12} md={4}>
          <Stack spacing={2} alignItems="center">
            {fotos[0] ? (
              <Avatar
                src={fotos[0]}
                alt={pigeon.nombre}
                sx={{ width: 180, height: 180 }}
              />
            ) : (
              <Avatar sx={{ width: 180, height: 180, bgcolor: "grey.200" }}>
                <PhotoOutlined fontSize="large" />
              </Avatar>
            )}
            <Typography variant="h5">{pigeon.nombre}</Typography>
            <Typography color="text.secondary">#{pigeon.numero}</Typography>
            <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
              {pigeon.estado && <Chip label={pigeon.estado} />}
              {pigeon.tipo && <Chip label={pigeon.tipo} />}
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ficha de datos
              </Typography>
              <FieldRow label={FIELD_LABELS.color} value={pigeon.color} />
              <FieldRow label={FIELD_LABELS.sexo} value={pigeon.sexo} />
              {renderRelation(FIELD_LABELS.padre, padreRef, pigeon.padre)}
              {renderRelation(FIELD_LABELS.madre, madreRef, pigeon.madre)}
              {renderRelation(FIELD_LABELS.pareja, parejaRef, pigeon.pareja)}
              {renderDateRow(
                FIELD_LABELS.fechaNacimiento,
                pigeon.fechaNacimiento,
                "nacimiento"
              )}
              {renderDateRow(
                FIELD_LABELS.fechaLlegada,
                pigeon.fechaLlegada,
                "llegada"
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Descripcion
        </Typography>
        <Box
          sx={{
            border: "1px solid #eee",
            borderRadius: 2,
            p: 2,
            whiteSpace: "pre-wrap",
            minHeight: 120
          }}
        >
          <Typography>{descripcion || "Sin descripcion."}</Typography>
        </Box>
      </Box>

      {fotos.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Galeria
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
            gap={2}
          >
            {fotos.map((src, index) => (
              <Box
                key={src}
                component="img"
                src={src}
                alt={`${pigeon.nombre} ${index + 1}`}
                onClick={() => setLightboxIndex(index)}
                sx={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer"
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Dialog
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 1, position: "relative" }}>
          <IconButton
            onClick={() => setLightboxIndex(null)}
            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white" }}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              setLightboxIndex((prev) =>
                prev === null ? 0 : (prev - 1 + fotos.length) % fotos.length
              )
            }
            sx={{ position: "absolute", top: "50%", left: 8, bgcolor: "white" }}
            aria-label="Anterior"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() =>
              setLightboxIndex((prev) =>
                prev === null ? 0 : (prev + 1) % fotos.length
              )
            }
            sx={{ position: "absolute", top: "50%", right: 8, bgcolor: "white" }}
            aria-label="Siguiente"
          >
            <ChevronRight />
          </IconButton>
          {lightboxSrc && (
            <Box
              component="img"
              src={lightboxSrc}
              alt={pigeon.nombre}
              sx={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "block",
                margin: "0 auto"
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
