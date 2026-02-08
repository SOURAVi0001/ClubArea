import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkSession } from '@/services/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export function useSessionCheck() {
    const hydrate = useAuthStore((s) => s.hydrate);

    const { data, isLoading } = useQuery({
        queryKey: ['session'],
        queryFn: checkSession,
        staleTime: 1000 * 60 * 10, // 10 mins
        retry: false,
    });

    useEffect(() => {
        if (data) {
            hydrate(data);
        }
    }, [data, hydrate]);

    return { isLoading };
}
