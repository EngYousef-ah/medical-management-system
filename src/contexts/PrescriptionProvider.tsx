import { useState, useEffect } from "react";
import axios from "axios";
import type { TypePrescription } from "@/types/TypePrescription";
import { PrescriptionContext } from "./PrescriptionContext";
import useFetch from "@/hooks/useFetch";
type Props = {
    children: React.ReactNode;
}

const API_URL = "https://69c68e89f272266f3eacc5b5.mockapi.io";
export function PrescriptionProvider({ children }: Props) {

    const { data, loading } = useFetch(`${API_URL}/prescription`)

    const [prescriptions, setPrescriptions] = useState<TypePrescription[]>([]);

    useEffect(() => {
        if (data) setPrescriptions(data);
    }, [data]);


    const refreshPrescriptions = async () => {
        try {
            const response = await axios.get(`${API_URL}/prescription`);
            setPrescriptions(response.data);
        } catch (err) {
            console.log("Error fetching prescriptions" + err);
        }
    };

    return (
        <PrescriptionContext.Provider value={{ prescriptions, setPrescriptions, refreshPrescriptions, loading }}>
            {children}
        </PrescriptionContext.Provider>
    );
}