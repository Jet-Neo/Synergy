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
    },

    update: async (id, taskData) => {
        const res = await fetch(`${API_BASE}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        if (!res.ok) {
            throw new Error("Failed to update task");
        }

        return res.status === 204 ? null : await res.json();
    },

    remove: async (id) => {
        const res = await fetch(`${API_BASE}/tasks/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to delete task");
        }

        return true;
    }
};

export const workLogs = {
    getAll: () => request("/worklogs"),

    create: async (workLogData) => {
        const res = await fetch(`${API_BASE}/worklogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(workLogData),
        });

        if (!res.ok) {
            throw new Error("Failed to create work log");
        }

        return await res.json();
    }
};

export const teams = {
    getAll: () => request("/teams"),

    create: async (teamData) => {
        const res = await fetch(`${API_BASE}/teams`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teamData),
        });

        if (!res.ok) {
            throw new Error("Failed to create team");
        }

        return await res.json();
    },

    update: async (id, teamData) => {
        const res = await fetch(`${API_BASE}/teams/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teamData),
        });

        if (!res.ok) {
            throw new Error("Failed to update team");
        }

        return res.status === 204 ? null : await res.json();
    },

    remove: async (id) => {
        const res = await fetch(`${API_BASE}/teams/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to delete team");
        }

        return true;
    }
};

export const users = {
    getAll: () => request("/users"),

    create: async (userData) => {
        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            throw new Error("Failed to create user");
        }

        return await res.json();
    },

    update: async (id, userData) => {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            throw new Error("Failed to update user");
        }

        return res.status === 204 ? null : await res.json();
    }
};

export const teamMembers = {
    getAll: () => request("/teammembers"),

    create: async (teamMemberData) => {
        const res = await fetch(`${API_BASE}/teammembers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teamMemberData),
        });

        if (!res.ok) {
            throw new Error("Failed to add member to team");
        }

        return await res.json();
    },

    remove: async (id) => {
        const res = await fetch(`${API_BASE}/teammembers/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to remove member from team");
        }

        return true;
    }
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