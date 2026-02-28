import { api } from './axios';

export async function fetchUpdates() {
    const { data } = await api.get('/updates');
    return data.updates || [];
}

export async function fetchGallery() {
    const { data } = await api.get('/gallery');
    return data.clubGalleries || [];
}

export async function fetchRecruitment() {
    const { data } = await api.get('/recruitment');
    return data.opening || [];
}
