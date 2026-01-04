import { useQuery } from "@tanstack/react-query";
import { getPigeons } from "./pigeonsProvider";

export const usePigeonsQuery = () => {
  return useQuery({
    queryKey: ["pigeons"],
    queryFn: getPigeons
  });
};
