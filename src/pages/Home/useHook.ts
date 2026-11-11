import { useEffect, useState } from "react";
import api from "../../api";
import type { Watch } from "../../interfaces/watch";
import { toast } from "react-toastify";

export const useHook = (searchTerm: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [watches, setWatches] = useState<Watch[]>([]);
    const [loadedSearch, setLoadedSearch] = useState<string | null>(null);

    useEffect(() => {
        let isCurrentRequest = true;

        const getWatches = async () => {
            setIsLoading(true);
            setWatches([]);
            setLoadedSearch(null);

            try {
                const response = searchTerm
                    ? await api.get('/watches', { params: { name: searchTerm } })
                    : await api.get('/watches');

                if (isCurrentRequest) {
                    setWatches(response.data);
                }
            } catch {
                if (isCurrentRequest) {
                    setWatches([]);
                    toast.error('No se pudieron cargar los relojes. Intenta nuevamente.');
                }
            } finally {
                if (isCurrentRequest) {
                    setIsLoading(false);
                    setLoadedSearch(searchTerm);
                }
            }
        };

        void getWatches();

        return () => {
            isCurrentRequest = false;
        };
    }, [searchTerm]);

    return { isLoading, watches, loadedSearch };
}
