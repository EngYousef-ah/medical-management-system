import { useState, useEffect } from "react";
import axios from "axios";
import { AppointmentContext } from "./AppointmentContext";
import type { TypeAppointment } from "@/types/TypeAppointment";
import useFetch from "@/hooks/useFetch";
const API_URL = "http://localhost:3000/appointment";
type Props = {
  children: React.ReactNode;
};

export function AppointmentProvider({ children }: Props) {
  const { data, loading, error } = useFetch(API_URL);

  const [appointments, setAppointments] = useState<TypeAppointment[]>([]);


  useEffect(() => {
    if (data) setAppointments(data);
  }, [data]);

  const refreshAppointments = async () => {
    try {
      const response = await axios.get(API_URL);
      setAppointments(response.data);
    } catch (err) {
      console.log("Error fetching Appointments" + err);
    }
  };

  return (
    <AppointmentContext.Provider value={{ appointments, setAppointments, refreshAppointments, loading, error }}>
      {children}
    </AppointmentContext.Provider>
  );
}