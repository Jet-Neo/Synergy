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
        console.log("Login:", email, password);
        localStorage.setItem("user", JSON.stringify({ email }));
        return true;
    },

    async signup(email, password, name) {
        console.log("Signup:", email, password, name);
        localStorage.setItem("user", JSON.stringify({ email, name }));
        return true;
    },

    async logout() {
        localStorage.removeItem("user");
        return true;
    },

    async getSession() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
};