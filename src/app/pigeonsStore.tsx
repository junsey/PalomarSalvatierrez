import { createContext, useContext, useMemo, useState } from "react";
import { Pigeon } from "../types/pigeon";

type PigeonsStoreValue = {
  localPigeons: Pigeon[];
  upsertPigeon: (pigeon: Pigeon) => void;
};

const PigeonsStoreContext = createContext<PigeonsStoreValue | undefined>(
  undefined
);

export const PigeonsStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [localPigeons, setLocalPigeons] = useState<Pigeon[]>([]);

  const upsertPigeon = (pigeon: Pigeon) => {
    setLocalPigeons((prev) => {
      const idx = prev.findIndex(
        (item) => item.numero.toLowerCase() === pigeon.numero.toLowerCase()
      );
      if (idx === -1) return [...prev, pigeon];
      const updated = [...prev];
      updated[idx] = { ...prev[idx], ...pigeon };
      return updated;
    });
  };

  const value = useMemo(() => ({ localPigeons, upsertPigeon }), [localPigeons]);

  return (
    <PigeonsStoreContext.Provider value={value}>
      {children}
    </PigeonsStoreContext.Provider>
  );
};

export const usePigeonsStore = () => {
  const ctx = useContext(PigeonsStoreContext);
  if (!ctx) {
    throw new Error("usePigeonsStore must be used within provider");
  }
  return ctx;
};
