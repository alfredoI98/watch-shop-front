import { useEffect, useState } from "react";
import api from "../../api";
import type { Watch } from "../../interfaces/watch";

export const useHook = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [watches, setWatches] = useState<Watch[]>([]);

    const getWatches = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/watches');
            setWatches(response.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getWatches();
    }, []);

    return { isLoading, watches };
}
