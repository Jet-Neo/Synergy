const API_BASE = "/api";

async function request(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);

        if (!res.ok) {
            throw new Error("API request failed");
        }

        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const tasks = {
    getAll: () => request("/tasks"),

    create: async (taskData) => {
        const res = await fetch(`${API_BASE}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        if (!res.ok) {
            throw new Error("Failed to create task");
        }

        return await res.json();
    }
};

export const workLogs = {
    getAll: () => request("/worklogs")
};

export const auth = {
    async login(email, password) {
        const res = await fetch(`${API_BASE}/account/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            const message = body?.message || "Failed to log in";
            throw new Error(message);
        }

        return body;
    },

    async signup(email, password, name) {
        const res = await fetch(`${API_BASE}/account/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            throw new Error("Failed to sign up");
        }

        const data = await res.json();
        return data;
    },

    async logout() {
        const res = await fetch(`${API_BASE}/account/logout`, {
            method: "POST",
        });

        if (!res.ok) {
            throw new Error("Failed to log out");
        }

        return true;
    },

    async getSession() {
        const res = await fetch(`${API_BASE}/account/session`, {
            method: "GET",
        });

        if (!res.ok) {
            // 401 means no active session
            return null;
        }

        const data = await res.json();
        return data;
    },
};