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
    getAll: () => request("/tasks")
};

export const workLogs = {
    getAll: () => request("/worklogs")
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