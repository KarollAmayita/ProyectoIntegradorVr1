const API = 'http://localhost:3001/api/auth';
let token = localStorage.getItem('token');
let refreshTokenStored = localStorage.getItem('refreshToken');

const showLogin = () => {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
};

const showRegister = () => {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
};

const showDashboard = () => {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
};

const login = async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    document.getElementById('login-result').textContent = JSON.stringify(data, null, 2);

    if (data.token) {
      token = data.token;
      refreshTokenStored = data.refreshToken;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshTokenStored);
      document.getElementById('user-info').textContent = `Usuario: ${data.user.username} (${data.user.rol})`;
      showDashboard();
    }
  } catch (err) {
    document.getElementById('login-result').textContent = err.message;
  }
};

const register = async () => {
  const payload = {
    nombre: document.getElementById('reg-nombre').value,
    apellido: document.getElementById('reg-apellido').value,
    email: document.getElementById('reg-email').value,
    username: document.getElementById('reg-username').value,
    password: document.getElementById('reg-password').value,
    rol_id: parseInt(document.getElementById('reg-rol').value),
    pais_id: parseInt(document.getElementById('reg-pais').value) || undefined
  };

  try {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    document.getElementById('register-result').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById('register-result').textContent = err.message;
  }
};

const refreshToken = async () => {
  try {
    const res = await fetch(`${API}/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTokenStored })
    });
    const data = await res.json();
    document.getElementById('dashboard-result').textContent = JSON.stringify(data, null, 2);

    if (data.token) {
      token = data.token;
      localStorage.setItem('token', token);
    }
  } catch (err) {
    document.getElementById('dashboard-result').textContent = err.message;
  }
};

const logout = async () => {
  try {
    await fetch(`${API}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ refreshToken: refreshTokenStored })
    });
    token = null;
    refreshTokenStored = null;
    localStorage.clear();
    showLogin();
  } catch (err) {
    console.error(err);
  }
};

const logoutAll = async () => {
  try {
    const res = await fetch(`${API}/logout-all`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    document.getElementById('dashboard-result').textContent = JSON.stringify(data, null, 2);
    token = null;
    refreshTokenStored = null;
    localStorage.clear();
    showLogin();
  } catch (err) {
    document.getElementById('dashboard-result').textContent = err.message;
  }
};

// Auto-login if token exists
if (token) {
  showDashboard();
}
