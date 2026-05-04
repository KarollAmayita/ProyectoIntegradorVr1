// auth.js - Manejo de autenticación

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('login')) {
        setupLogin();
    } else if (path.includes('register')) {
        setupRegister();
    } else if (path.includes('dashboard')) {
        setupDashboard();
    }
});

// ===== LOGIN =====
function setupLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username')?.value?.trim();
        const password = document.getElementById('password')?.value;
        
        if (!username || !password) {
            showError('Por favor completa todos los campos');
            return;
        }
        
        const btn = document.getElementById('loginBtn');
        if (btn) btn.disabled = true;
        hideError();
        
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            showError(error.message);
        } finally {
            if (btn) btn.disabled = false;
        }
    });
}

// ===== REGISTER =====
function setupRegister() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre')?.value?.trim();
        const apellido = document.getElementById('apellido')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const username = document.getElementById('username')?.value?.trim();
        const password = document.getElementById('password')?.value;
        const rol_id = document.getElementById('rol_id')?.value;
        const pais_id = document.getElementById('pais_id')?.value;
        
        if (!nombre || !apellido || !email || !username || !password || !rol_id) {
            showError('Por favor completa todos los campos obligatorios');
            return;
        }
        
        const btn = document.getElementById('registerBtn');
        if (btn) btn.disabled = true;
        hideError();
        
        try {
            const payload = { nombre, apellido, email, username, password, rol_id };
            if (pais_id) payload.pais_id = pais_id;
            
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al registrarse');
            }
            
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'login.html';
            
        } catch (error) {
            showError(error.message);
        } finally {
            if (btn) btn.disabled = false;
        }
    });
    
    loadPaises();
    setupRolChange();
}

// ===== DASHBOARD =====
function setupDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userNameEl = document.getElementById('userName');
    const welcomeTitleEl = document.getElementById('welcomeTitle');
    
    if (userNameEl) userNameEl.textContent = user.username || 'Usuario';
    if (welcomeTitleEl) welcomeTitleEl.textContent = `Bienvenido, ${user.nombre || 'Usuario'}`;
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                try {
                    await fetch('http://localhost:3001/api/auth/logout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                    });
                } catch (e) {
                    console.error('Error al cerrar sesión:', e);
                }
            }
            
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// ===== UTILS =====
async function loadPaises() {
    try {
        const response = await fetch('http://localhost:3001/api/countries/active');
        const data = await response.json();
        
        const select = document.getElementById('pais_id');
        if (select && data.value) {
            data.value.forEach(pais => {
                const option = document.createElement('option');
                option.value = pais.id;
                option.textContent = pais.nombre;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando países:', error);
    }
}

function setupRolChange() {
    const rolSelect = document.getElementById('rol_id');
    const paisGroup = document.getElementById('paisGroup');
    
    if (!rolSelect || !paisGroup) return;
    
    rolSelect.addEventListener('change', () => {
        const rolId = rolSelect.value;
        paisGroup.style.display = (rolId === '2' || rolId === '3') ? 'block' : 'none';
    });
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) errorDiv.style.display = 'none';
}
