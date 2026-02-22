import { api } from './axios';

export const memberService = {
    // Events
    getEvents: (page = 1) => api.get(`/member_events?page=${page}`).then(res => res.data),

    // Updates
    getUpdates: (page = 1) => api.get(`/member_updates?page=${page}`).then(res => res.data),

    // Feedback
    getFeedback: () => api.get('/member_feedback').then(res => res.data),
    submitFeedback: (data) => api.post('/member_feedback', data).then(res => res.data),

    // Task Status
    getTasks: (search = '', limit = 10) => api.get(`/member_Task_Status?search=${search}&limit=${limit}`).then(res => res.data),
    getTaskDetails: (id) => api.get(`/View-Details/${id}`).then(res => res.data),

    // Contact
    getContact: () => api.get('/member_leader_contact').then(res => res.data),
};
