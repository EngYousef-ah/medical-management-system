import { useState, useEffect } from "react";
import axios from "axios";
import { AppointmentContext } from "./AppointmentContext";
import type { TypeAppointment } from "@/types/TypeAppointment";
import useFetch from "@/hooks/useFetch";
type Props = {
  children: React.ReactNode;
};

const API_URL = "https://69c68e89f272266f3eacc5b5.mockapi.io";
export function AppointmentProvider({ children }: Props) {
  const { data, loading, error } = useFetch(`${API_URL}/appointment`);

  const [appointments, setAppointments] = useState<TypeAppointment[]>([]);


  useEffect(() => {
    if (data) setAppointments(data);
  }, [data]);

  const refreshAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointment`);
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