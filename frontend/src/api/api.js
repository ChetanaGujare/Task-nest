const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Request failed');
    }
    return data;
}

export const authAPI = {
    register: (body) => apiFetch('/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => apiFetch('/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => apiFetch('/me'),
};

export const todoAPI = {
    getAll: () => apiFetch('/todos'),
    create: (body) => apiFetch('/todos', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => apiFetch(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => apiFetch(`/todos/${id}`, { method: 'DELETE' }),
};