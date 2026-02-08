import { api } from './axios';

export async function loginUser(credentials) {
    const { data } = await api.post('/user_login_post', credentials);
    return data;
}

export async function loginAdmin(credentials) {
    const { data } = await api.post('/admin_login_post', credentials);
    return data;
}

export async function registerUser(userData) {
    const { data } = await api.post('/VALIDATE', userData);
    return data;
}

export async function checkSession() {
    const { data } = await api.get('/check-session');
    return data;
}
