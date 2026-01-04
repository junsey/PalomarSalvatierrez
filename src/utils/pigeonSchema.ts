import { z } from "zod";
import { isValidUrl } from "./validators";

export const pigeonSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  numero: z.string().min(1, "Numero requerido"),
  color: z.string().optional(),
  sexo: z.string().optional(),
  descripcion: z.string().optional(),
  padre: z.string().optional(),
  madre: z.string().optional(),
  pareja: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  fechaLlegada: z.string().optional(),
  tipo: z.string().optional(),
  estado: z.string().optional(),
  foto: z
    .string()
    .optional()
    .refine((val) => !val || isValidUrl(val), "Foto debe ser URL valida")
});

export type PigeonFormValues = z.infer<typeof pigeonSchema>;
