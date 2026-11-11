import { useEffect, useState } from "react";
import api from "../../api";
import type { Watch } from "../../interfaces/watch";
import { toast } from "react-toastify";

const searchFields = ['search', 'brand', 'category', 'movementType', 'waterResistance'] as const;

export const useHook = (searchKey: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [watches, setWatches] = useState<Watch[]>([]);
    const [loadedSearch, setLoadedSearch] = useState<string | null>(null);

    useEffect(() => {
        let isCurrentRequest = true;

        const getWatches = async () => {
            const searchParams = new URLSearchParams(searchKey);
            const requestParams: Record<string, string> = {};

            searchFields.forEach((field) => {
                const value = searchParams.get(field)?.trim();
                if (value) {
                    requestParams[field === 'search' ? 'name' : field] = value;
                }
            });

            setIsLoading(true);
            setWatches([]);
            setLoadedSearch(null);

            try {
                const response = await api.get('/watches', {
                    params: requestParams,
                });

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
                    setLoadedSearch(searchKey);
                }
            }
        };

        void getWatches();

        return () => {
            isCurrentRequest = false;
        };
    }, [searchKey]);

    return { isLoading, watches, loadedSearch };
}
