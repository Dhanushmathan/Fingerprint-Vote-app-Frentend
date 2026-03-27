import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Response interceptor - handle errors globally
api.interceptors.response.use(
    res => res,
    err => {
        const msg = err.response?.data?.message || 'Something went wrong';
        const errCode = err.response?.data?.error;
        // Don't toast for ALREADY_VOTED - handled in component
        if (errCode !== 'ALREADY_VOTED') {
            toast.error(msg);
        }
        return Promise.reject(err);
    }
)

// ── PARTIES ─────────────────────────────────────────
export const partyAPI = {
    getAll: () => api.get('/parties'),
    getById: (id) => api.get(`/parties/${id}`),
    register: (data) => api.post('/parties', data),
    delete: (id) => api.delete(`/parties/${id}`),
}

// ── VOTERS ──────────────────────────────────────────
export const voterAPI = {
    register: (data) => api.post('/voters/register', data),
    getByVoterId: (id) => api.get(`/voters/${id}`),
    getAll: () => api.get('/voters'),
}

// ── OTP ─────────────────────────────────────────────
export const otpAPI = {
    send: (data) => api.post('/otp/send', data),
    verify: (data) => api.post('/otp/verify', data),
}

// ── VOTES ────────────────────────────────────────────
export const voteAPI = {
    cast: (data) => api.post('/votes/cast', data),
    getResults: () => api.get('/votes/results'),
}

export default api;
