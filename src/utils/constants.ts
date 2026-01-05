export const ESTADOS = ["en palomar", "desaparecida", "fallecida"] as const;

export const TIPOS = ["Local", "Rescatada", "Comprada"] as const;

export const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre",
  numero: "Numero",
  color: "Color",
  fenotipo: "Fenotipo",
  sexo: "Sexo",
  descripcion: "Descripcion",
  padre: "Padre",
  madre: "Madre",
  pareja: "Pareja",
  fechaNacimiento: "Fecha de nacimiento",
  fechaLlegada: "Fecha de llegada",
  tipo: "Tipo",
  estado: "Estado",
  foto: "Foto"
};
