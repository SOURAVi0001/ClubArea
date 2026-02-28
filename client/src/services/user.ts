import { api } from './axios';

export async function fetchUserData() {
    const { data } = await api.get('/user');
    // data matches { PageTitle, opening, openingsApplied, email, username }
    return data;
}

export async function fetchUserApplications() {
    const { data } = await api.get('/user-applications');
    return data.applications || [];
}

export async function fetchUserAppliedRoles() {
    const { data } = await api.get('/user-applied-roles');
    return data.appliedRoles || [];
}
