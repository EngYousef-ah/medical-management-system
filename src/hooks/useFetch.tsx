import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch(url: string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await axios.get(url);
                setData(response.data);

            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("Unknown Error");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url]);
    return { data, loading, error };
}