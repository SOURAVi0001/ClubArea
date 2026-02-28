import { useQuery } from '@tanstack/react-query';
import { fetchUserData, fetchUserApplications, fetchUserAppliedRoles } from '../services/user';

export function useUserDataQuery() {
    return useQuery({
        queryKey: ['user', 'dashboard'],
        queryFn: fetchUserData,
    });
}

export function useUserApplicationsQuery() {
    return useQuery({
        queryKey: ['user', 'applications'],
        queryFn: fetchUserApplications,
    });
}

export function useUserAppliedRolesQuery() {
    return useQuery({
        queryKey: ['user', 'appliedRoles'],
        queryFn: fetchUserAppliedRoles,
    });
}
