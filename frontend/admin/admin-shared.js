/* Panel admin compartido: sesión, API, layout y permisos por rol */

const URL_BACKEND = '/api';
const BASE_ADMIN = '/admin';

/* Paleta por código de país (AR, CL, EC). Superadmin usa DEFAULT. */
const COUNTRY_THEMES = {
  AR: {
    primary: '#6CACE4',
    accent: '#F6B40E',
    sidebar: '#1B3A5C',
    brandLine1: 'Argentina',
    brandLine2: 'CMS Multiplataforma'
  },
  CL: {
    primary: '#D52B1E',
    accent: '#FFFFFF',
    sidebar: '#0039A6',
    brandLine1: 'Chile',
    brandLine2: 'CMS Multiplataforma'
  },
  EC: {
    primary: '#F4B400',   
    accent: '#1F3A5F',    
    sidebar: '#A31621', 
    brandLine1: 'Ecuador',
    brandLine2: 'CMS Multiplataforma'
  },
  DEFAULT: {
    primary: '#1B3A5C',
    accent: '#74ACDF',
    sidebar: '#0F2A4A',
    brandLine1: 'CMS',
    brandLine2: 'Multiplataforma'
  }
};

/* ------------------------------------------------------------
   SESIÓN
   ------------------------------------------------------------ */
function obtenerToken() {
  return localStorage.getItem('token');
}

function obtenerUsuario() {
  const datos = localStorage.getItem('user');
  return datos ? JSON.parse(datos) : null;
}

function guardarSesion(token, usuario, refreshToken) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(usuario));
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

function limpiarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('demoMode');
  localStorage.removeItem('demoRolActivo');
}

/** Limpia tokens ficticios guardados en versiones anteriores del front. */
function esSesionDemoResidual() {
  const token = obtenerToken();
  return (
    localStorage.getItem('demoMode') === 'true' ||
    (token && token.startsWith('demo-token-'))
  );
}

function obtenerUrlDashboardPorRol(rol) {
  const rutas = {
    superadmin: `${BASE_ADMIN}/dashboard-superadmin`,
    admin_pais: `${BASE_ADMIN}/dashboard-admin`,
    editor: `${BASE_ADMIN}/dashboard-editor`
  };
  return rutas[rol] || `${BASE_ADMIN}/login`;
}

function redirigirAlDashboardDelUsuario() {
  const usuario = obtenerUsuario();
  window.location.href = obtenerUrlDashboardPorRol(usuario?.rol);
}

function exigirRol(...rolesPermitidos) {
  exigirSesion();
  const usuario = obtenerUsuario();
  if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
    redirigirAlDashboardDelUsuario();
    return false;
  }
  return true;
}

/* ------------------------------------------------------------
   TEMA VISUAL POR PAÍS
   ------------------------------------------------------------ */
function obtenerCodigoPaisUsuario(usuario) {
  return usuario?.pais?.codigo || 'DEFAULT';
}

function obtenerMarcaUsuario(usuario) {
  const codigo = obtenerCodigoPaisUsuario(usuario);
  const tema = COUNTRY_THEMES[codigo] || COUNTRY_THEMES.DEFAULT;
  return { linea1: tema.brandLine1, linea2: tema.brandLine2 };
}

function aplicarTemaPais(usuario) {
  const codigo = obtenerCodigoPaisUsuario(usuario);
  const tema = COUNTRY_THEMES[codigo] || COUNTRY_THEMES.DEFAULT;
  const root = document.documentElement;

  root.style.setProperty('--color-primary', tema.primary);
  root.style.setProperty('--color-accent', tema.accent);
  root.style.setProperty('--color-sidebar', tema.sidebar);
  root.style.setProperty('--celeste-medio', tema.primary);
  root.style.setProperty('--azul-oscuro-fondo', tema.sidebar);
  root.style.setProperty('--azul-marino', tema.sidebar);

  if (document.body) {
    document.body.dataset.country = codigo.toLowerCase();
  }
}

function exigirSesion() {
  if (esSesionDemoResidual()) {
    limpiarSesion();
    window.location.href = `${BASE_ADMIN}/login`;
    return;
  }

  const token = obtenerToken();
  if (!token) {
    window.location.href = `${BASE_ADMIN}/login`;
    return;
  }

  const usuario = obtenerUsuario();
  if (!usuario || !usuario.rol) {
    limpiarSesion();
    window.location.href = `${BASE_ADMIN}/login`;
    return;
  }

  aplicarTemaPais(usuario);
}

/** Respuestas del API: array directo o { data: [] }. */
function normalizarListaApi(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (respuesta?.data && Array.isArray(respuesta.data)) return respuesta.data;
  return [];
}

async function llamarApi(ruta, opciones = {}) {
  const token = obtenerToken();
  const cabeceras = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opciones.headers || {})
  };

  const respuesta = await fetch(`${URL_BACKEND}${ruta}`, {
    method: opciones.method || 'GET',
    headers: cabeceras,
    body: opciones.body ? JSON.stringify(opciones.body) : undefined
  });

  if (respuesta.status === 401) {
    limpiarSesion();
    window.location.href = `${BASE_ADMIN}/login`;
    throw new Error('Sesión expirada');
  }

  let datos = null;
  const tipoContenido = respuesta.headers.get('content-type') || '';
  if (tipoContenido.includes('application/json')) {
    datos = await respuesta.json();
  }

  if (!respuesta.ok) {
    const mensaje = datos?.message || `Error ${respuesta.status}`;
    throw new Error(mensaje);
  }

  return datos;
}

function obtenerIdDashboardPorRol(rol) {
  const ids = {
    superadmin: 'dashboard-superadmin',
    admin_pais: 'dashboard-admin',
    editor: 'dashboard-editor'
  };
  return ids[rol] || 'dashboard';
}

function pintarSidebar(paginaActiva) {
  const usuario = obtenerUsuario();
  if (!usuario) return;

  aplicarTemaPais(usuario);
  const rol = usuario.rol;
  const marca = obtenerMarcaUsuario(usuario);
  const dashboardId = obtenerIdDashboardPorRol(rol);

  const enlaces = [
    { id: dashboardId, archivo: obtenerUrlDashboardPorRol(rol).replace(BASE_ADMIN + '/', ''), icono: 'speedometer2', etiqueta: 'Dashboard', roles: ['superadmin', 'admin_pais', 'editor'] },
    { id: 'noticias', archivo: 'noticias.html', icono: 'newspaper', etiqueta: 'Noticias', roles: ['superadmin', 'admin_pais', 'editor'] },
    { id: 'testimonios', archivo: 'testimonios.html', icono: 'chat-quote', etiqueta: 'Testimonios', roles: ['superadmin', 'admin_pais', 'editor'] },
    { id: 'solicitudes', archivo: 'solicitudes.html', icono: 'envelope', etiqueta: 'Solicitudes', roles: ['superadmin', 'admin_pais'] },
    { id: 'usuarios', archivo: 'usuarios.html', icono: 'people', etiqueta: 'Usuarios', roles: ['superadmin'] },
    { id: 'auditoria', archivo: 'auditoria.html', icono: 'journal-text', etiqueta: 'Auditoría', roles: ['superadmin', 'admin_pais'] },
    { id: 'conexiones', archivo: 'conexiones.html', icono: 'clock-history', etiqueta: 'Conexiones', roles: ['superadmin', 'admin_pais'] }
  ];

  const enlacesPermitidos = enlaces.filter((enlace) => enlace.roles.includes(rol));
  const idsActivosDashboard = ['dashboard', 'dashboard-superadmin', 'dashboard-admin', 'dashboard-editor'];
  const esPaginaDashboard = idsActivosDashboard.includes(paginaActiva);

  const htmlEnlaces = enlacesPermitidos.map((enlace) => {
    const activo = esPaginaDashboard
      ? enlace.id === dashboardId
      : enlace.id === paginaActiva;
    const href = enlace.archivo.includes('dashboard')
      ? obtenerUrlDashboardPorRol(rol)
      : `${BASE_ADMIN}/${enlace.id}`;
    return `
      <a href="${href}" class="barra-lateral__enlace ${activo ? 'barra-lateral__enlace--activo' : ''}">
        <i class="bi bi-${enlace.icono}"></i>
        ${enlace.etiqueta}
      </a>
    `;
  }).join('');

  const zona = document.getElementById('zona-sidebar');
  if (zona) {
    zona.innerHTML = `
      <aside class="barra-lateral">
        <div class="barra-lateral__marca">
          <div class="barra-lateral__marca-titulo">
            <span class="marca-brand">${marca.linea1}</span>
            <span class="marca-sec">${marca.linea2}</span>
          </div>
          <p class="barra-lateral__subtitulo">Panel administrativo</p>
        </div>
        <p class="barra-lateral__seccion-titulo">Menú</p>
        <nav class="barra-lateral__menu">${htmlEnlaces}</nav>
      </aside>
    `;
  }
}

function pintarTopbar(tituloPagina) {
  const usuario = obtenerUsuario();
  if (!usuario) return;

  const nombrePais = usuario.pais?.nombre || 'Todos los países';
  const zona = document.getElementById('zona-topbar');

  if (zona) {
    zona.innerHTML = `
      <header class="barra-superior-admin">
        <h1 class="barra-superior-admin__titulo">${tituloPagina}</h1>
        <div class="barra-superior-admin__usuario">
          <div class="distintivo-usuario">
            <i class="bi bi-person-circle"></i>
            ${usuario.nombre} ${usuario.apellido}
            <span class="distintivo-usuario__rol">${usuario.rol}</span>
          </div>
          <span style="font-size:12px; color:#5A6C84;">
            <i class="bi bi-geo-alt-fill"></i> ${nombrePais}
          </span>
          <button class="boton-cerrar-sesion" id="boton-cerrar-sesion">
            <i class="bi bi-box-arrow-right"></i>
            Cerrar sesión
          </button>
        </div>
      </header>
    `;
    document.getElementById('boton-cerrar-sesion').addEventListener('click', cerrarSesion);
  }
}

function cerrarSesion() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    fetch(`${URL_BACKEND}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    }).catch(() => {});
  }

  limpiarSesion();
  window.location.href = `${BASE_ADMIN}/login`;
}

window.addEventListener('beforeunload', function () {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    const data = JSON.stringify({ refreshToken });
    navigator.sendBeacon(`${URL_BACKEND}/auth/session-end`, new Blob([data], { type: 'application/json' }));
  }
});

function abrirModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) modal.classList.add('fondo-modal--visible');
}

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) modal.classList.remove('fondo-modal--visible');
}

function formatearFecha(fechaIso, conHora = false) {
  if (!fechaIso) return '—';
  const fecha = new Date(fechaIso);
  const opts = { day: '2-digit', month: 'short', year: 'numeric' };
  if (conHora) {
    opts.hour = '2-digit';
    opts.minute = '2-digit';
  }
  return fecha.toLocaleDateString('es-AR', opts);
}

function escapeHtml(texto) {
  if (!texto) return '';
  const mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto).replace(/[&<>"']/g, (c) => mapa[c]);
}

function usuarioEs(...rolesPermitidos) {
  const usuario = obtenerUsuario();
  return usuario && rolesPermitidos.includes(usuario.rol);
}
