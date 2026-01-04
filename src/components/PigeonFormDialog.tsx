import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pigeonSchema, PigeonFormValues } from "../utils/pigeonSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (values: PigeonFormValues) => void;
};

export const PigeonFormDialog = ({ open, onClose, onSave }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PigeonFormValues>({
    resolver: zodResolver(pigeonSchema),
    defaultValues: {
      nombre: "",
      numero: "",
      color: "",
      sexo: "",
      descripcion: "",
      padre: "",
      madre: "",
      pareja: "",
      fechaNacimiento: "",
      fechaLlegada: "",
      tipo: "",
      estado: "",
      foto: ""
    }
  });

  const submit = (values: PigeonFormValues) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar/Editar paloma</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            {...register("nombre")}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
          />
          <TextField
            label="Numero"
            {...register("numero")}
            error={!!errors.numero}
            helperText={errors.numero?.message}
          />
          <TextField label="Color" {...register("color")} />
          <TextField label="Sexo" {...register("sexo")} />
          <TextField label="Descripcion" {...register("descripcion")} />
          <TextField label="Padre" {...register("padre")} />
          <TextField label="Madre" {...register("madre")} />
          <TextField label="Pareja" {...register("pareja")} />
          <TextField label="Fecha de nacimiento" {...register("fechaNacimiento")} />
          <TextField label="Fecha de llegada" {...register("fechaLlegada")} />
          <TextField label="Tipo" {...register("tipo")} />
          <TextField label="Estado" {...register("estado")} />
          <TextField
            label="Foto (URL)"
            {...register("foto")}
            error={!!errors.foto}
            helperText={errors.foto?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit(submit)}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
