import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { MedicalRecordContext } from "./MedicalRecordContext";
import type { TypeMedicalRecord } from "@/types/TypeMedicalRecord";
import useFetch from "@/hooks/useFetch";
const API_URL = "https://medicalsystem-api.free.beeceptor.com/";

type Props = {
    children: ReactNode;
}
export function MedicalRecordProvider({ children }: Props) {
    const { data, loading } = useFetch(`${API_URL}/medicalRecords`);
    const [records, setRecords] = useState<TypeMedicalRecord[]>([]);

    useEffect(() => {
        if (data) {
            setRecords(data);
        }
    }, [data])

    const refreshRecords = async () => {
        try {
            const response = await axios.get(`${API_URL}/medicalRecords`);
            setRecords(response.data);
        }
        catch (error) {
            console.log("Error fetching Medical Records" + error);
        }

    }

    return (
        <MedicalRecordContext.Provider value={{ records, setRecords, refreshRecords, loading }}>
            {children}
        </MedicalRecordContext.Provider>
    );
}