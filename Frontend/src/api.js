const BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders(includeJson = false) {
    const token = localStorage.getItem('token');
    return {
        ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function parseResponse(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const error = new Error(data?.error || data?.message || data?.msg || 'Request failed');
        error.status = res.status;
        error.payload = data;
        throw error;
    }
    return data;
}

export async function loginUser(email, password) {
    const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return parseResponse(res);
}

export async function registerUser(name, email, number, password) {
    const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, number, password }),
    });
    return parseResponse(res);
}

export async function fetchServices() {
    const res = await fetch(`${BASE}/services/`, {
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}

export async function fetchTopServices() {
    const res = await fetch(`${BASE}/services/`);
    const data = await res.json();
    if (Array.isArray(data)) return data.slice(0, 6);
    return [];
}

export async function fetchAvailableTimeslots() {
    const res = await fetch(`${BASE}/bookings/timeslots/available`);
    return parseResponse(res);
}

export async function fetchAllTimeslots() {
    const res = await fetch(`${BASE}/bookings/timeslots`, {
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}

export async function getServiceById(id) {
    const res = await fetch(`${BASE}/services/${id}`);
    return parseResponse(res);
}

export async function createBooking(body) {
    const res = await fetch(`${BASE}/bookings/create`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(body),
    });
    return parseResponse(res);
}

export async function createPayment(body) {
    const res = await fetch(`${BASE}/payments/create`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(body),
    });
    return parseResponse(res);
}

export async function getBooking(id) {
    const res = await fetch(`${BASE}/bookings/${id}`, {
        headers: getAuthHeaders(true),
    });
    return parseResponse(res);
}

// FIX 4: fetch only the logged-in user's own bookings
export async function fetchMyBookings() {
    const res = await fetch(`${BASE}/bookings/my`, {
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}

export async function fetchAllBookings() {
    const res = await fetch(`${BASE}/bookings/all`, {
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}

export async function approveBooking(id) {
    const res = await fetch(`${BASE}/bookings/approve/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}

export async function rejectBooking(id) {
    const res = await fetch(`${BASE}/bookings/reject/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}

export async function createService(body) {
    const res = await fetch(`${BASE}/services/`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(body),
    });
    return parseResponse(res);
}

export async function updateService(id, body) {
    const res = await fetch(`${BASE}/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(body),
    });
    return parseResponse(res);
}

export async function deleteService(id) {
    const res = await fetch(`${BASE}/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}

export async function createTimeslot(body) {
    const res = await fetch(`${BASE}/bookings/timeslots`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(body),
    });
    return parseResponse(res);
}

export async function updateTimeslot(id, body) {
    const res = await fetch(`${BASE}/bookings/timeslots/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(body),
    });
    return parseResponse(res);
}

export async function deleteTimeslot(id) {
    const res = await fetch(`${BASE}/bookings/timeslots/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return parseResponse(res);
}
