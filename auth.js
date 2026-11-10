const API_BASE = 'http://127.0.0.1:8000/api';

function getAccessToken() { return localStorage.getItem('access_token'); }
function getRefreshToken() { return localStorage.getItem('refresh_token'); }
function getUserName() { return localStorage.getItem('username'); }

function setSession(access, refresh, username) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    if (username) localStorage.setItem('username', username);
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

async function refreshAccessToken() {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    try {
        const response = await fetch(`${API_BASE}/auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            return data.access;
        } else {
            logout();
            return null;
        }
    } catch (err) {
        logout();
        return null;
    }
}

async function authFetch(url, options = {}) {
    let token = getAccessToken();
    if (!options.headers) options.headers = {};

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, options);

    if (response.status === 401 && getRefreshToken()) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            options.headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, options); // Повторюємо запит
        }
    }

    return response;
}

function renderHeader() {
    const user = getUserName();
    const authNav = document.getElementById('auth-nav');
    if (!authNav) return;

    if (user && getAccessToken()) {
        authNav.innerHTML = `
            <span>Вітаємо, <strong>${user}</strong>!</span>
            <a href="admin.html">Панель додавання</a>
            <button onclick="logout()">Вийти</button>
        `;
    } else {
        authNav.innerHTML = `
            <a href="login.html">Увійти</a>
            <a href="register.html">Реєстрація</a>
        `;
    }
}