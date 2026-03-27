import { useState, useEffect } from "react";
import axios from "axios";
import { PatientContext } from "./PatientContext";
import type { TypePatient } from "@/types/TypePatient";
import useFetch from "@/hooks/useFetch";
type Props = {
    children: React.ReactNode;
};

const API_URL = "https://69c59dee8a5b6e2dec2cb4d4.mockapi.io";
export function PatientProvider({ children }: Props) {
    const { data, loading } = useFetch(`${API_URL}/patients`);
    const [patients, setPatients] = useState<TypePatient[]>([]);


    useEffect(() => {
        if (data) {
            setPatients(data)
        }
    }, [data])

    const refreshPatients = async () => {
        try {
            const response = await axios.get(`${API_URL}/patients`);
            setPatients(response.data)
        } catch (error) {
            console.log("Error fetching Patients" + error);
        }
    }



    return (
        <PatientContext.Provider value={{ patients, setPatients, refreshPatients, loading }}>
            {children}
        </PatientContext.Provider>
    );
}