import { api } from './axios';

export const leaderService = {
    // Dashboard
    getDashboard: () => api.get('/leader/leader-dashboard').then(res => res.data),

    // Openings
    getOpenings: () => api.get('/leader/openings').then(res => res.data),
    createOpening: (data) => api.post('/leader/create-opening', data).then(res => res.data),
    closeOpening: (id) => api.post(`/leader/close-opening/${id}`).then(res => res.data),
    getApplicants: (openingId) => api.get(`/leader/applicants/${openingId}`).then(res => res.data),
    reviewApplication: (applicantId, decision) => api.post(`/leader/review-application/${applicantId}`, { decision }).then(res => res.data),

    // Updates
    getUpdates: () => api.get('/leader/leader-updates').then(res => res.data),
    postUpdate: (data) => api.post('/leader/post-updates', data).then(res => res.data),

    // Events
    getEvents: () => api.get('/leader/leader-events').then(res => res.data),
    postEvent: (data) => api.post('/leader/post-event', data).then(res => res.data),

    // Tasks
    getTasks: () => api.get('/leader/leader-taskstatus').then(res => res.data),
    createTask: (data) => api.post('/leader/create-task', data).then(res => res.data),

    // Teams & Members
    getTeams: () => api.get('/leader/leader-teams').then(res => res.data),
    getMembers: () => api.get('/leader/leader-members').then(res => res.data),

    // Feedback
    getFeedback: () => api.get('/leader/leader-feedback').then(res => res.data),
};
