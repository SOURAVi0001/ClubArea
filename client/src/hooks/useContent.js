import { useQuery } from '@tanstack/react-query';
import { fetchUpdates, fetchGallery, fetchRecruitment } from '../services/content';

export function useUpdatesQuery() {
    return useQuery({
        queryKey: ['updates'],
        queryFn: fetchUpdates,
    });
}

export function useGalleryQuery() {
    return useQuery({
        queryKey: ['gallery'],
        queryFn: fetchGallery,
    });
}

export function useRecruitmentQuery() {
    return useQuery({
        queryKey: ['recruitment'],
        queryFn: fetchRecruitment,
    });
}
