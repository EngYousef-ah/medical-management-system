import { createContext } from "react";
import type { TypeAppointment } from "@/types/TypeAppointment";

export type AppointmentContextType = {
  appointments: TypeAppointment[];
  setAppointments: React.Dispatch<React.SetStateAction<TypeAppointment[]>>;
  refreshAppointments: () => Promise<void>;
  loading: boolean;
  error: string | null
};

export const AppointmentContext = createContext<AppointmentContextType | null>(null);

