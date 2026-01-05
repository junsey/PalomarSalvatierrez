import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Pigeon } from "../types/pigeon";
import { getLocalFotos } from "../utils/localPhotos";
import { getInitial, stringToColor } from "../utils/avatar";
import { getColorClass } from "../utils/colorClasses";

export const PigeonCard = ({ pigeon }: { pigeon: Pigeon }) => {
  const localFotos = getLocalFotos(pigeon.nombre);
  const fotoSrc = pigeon.foto || localFotos[0];
  const initial = getInitial(pigeon.nombre);
  const infoItems = [
    { label: "Sexo", value: pigeon.sexo },
    { label: "Fenotipo", value: pigeon.fenotipo },
    { label: "Pareja", value: pigeon.pareja }
  ].filter((item) => item.value);
  const colorClass = getColorClass(pigeon.color);

  return (
    <Box
      component={RouterLink}
      to={`/palomas/${encodeURIComponent(pigeon.numero)}`}
      sx={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        perspective: "1200px",
        "&:hover .flip-inner": {
          transform: "rotateY(180deg)"
        }
      }}
    >
      <Box
        className="flip-inner"
        sx={{
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          height: 260
        }}
      >
        <Card
          sx={{
            backfaceVisibility: "hidden",
            height: "100%",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <CardContent
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Stack spacing={1.5}>
              <Box display="flex" alignItems="center" gap={2}>
                {fotoSrc ? (
                  <Avatar
                    src={fotoSrc}
                    alt={pigeon.nombre}
                    sx={{ width: 72, height: 72 }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: stringToColor(pigeon.nombre)
                    }}
                  >
                    {initial}
                  </Avatar>
                )}
                <Box>
                  <Typography variant="h6">{pigeon.nombre}</Typography>
                  <Typography color="text.secondary">#{pigeon.numero}</Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap">
                {pigeon.estado && <Chip label={pigeon.estado} size="small" />}
                {pigeon.tipo && <Chip label={pigeon.tipo} size="small" />}
              </Box>
              {infoItems.length > 0 && (
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                  gap={1}
                >
                  {infoItems.map((item) => (
                    <Box key={item.label}>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Stack>
          </CardContent>
          <Box className={`color-bar ${colorClass}`} />
        </Card>
        <Card
          sx={{
            position: "absolute",
            inset: 0,
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            height: "100%",
            overflow: "hidden"
          }}
        >
          {fotoSrc ? (
            <Box
              component="img"
              src={fotoSrc}
              alt={pigeon.nombre}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          ) : (
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="grey.100"
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: stringToColor(pigeon.nombre),
                  fontSize: 48
                }}
              >
                {initial}
              </Avatar>
            </Box>
          )}
          <Box className={`color-bar ${colorClass}`} />
        </Card>
      </Box>
    </Box>
  );
};
