import { useEffect, useState } from "react";
import api from "../../api";
import type { Watch } from "../../interfaces/watch";
import { useCartStore } from "../../store/useCartStore";

export const useHook = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [watches, setWatches] = useState<Watch[]>([]);
    const idsProductsInCart = useCartStore((state) => state.cart);

    const getWatches = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/watches/ids', { ids: idsProductsInCart.map(item => item.productId) });
            setWatches(response.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getWatches();
    }, []);

    return { isLoading, watches, idsProductsInCart };
}