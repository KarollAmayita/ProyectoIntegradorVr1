/* ============================================================
   PANEL ADMIN - C\u00f3digo compartido por todas las pantallas
   - Configuraci\u00f3n del backend
   - Lectura/escritura de sesi\u00f3n (token y usuario)
   - Helper para llamar al API con JWT
   - Sidebar din\u00e1mica seg\u00fan el rol
   - Cerrar sesi\u00f3n
   - Apertura/cierre de modales
   ============================================================ */

const URL_BACKEND = '/api';

/* ------------------------------------------------------------
   SESI\u00d3N: leer/guardar/limpiar token y usuario
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
}

/* ------------------------------------------------------------
   AUTENTICACI\u00d3N: si no hay token, redirige al login
   Se llama al cargar cualquier p\u00e1gina del admin (excepto login).
   ------------------------------------------------------------ */
const BASE_ADMIN = '/admin';

function exigirSesion() {
  const token = obtenerToken();
  if (!token) {
    window.location.href = `${BASE_ADMIN}/login`;
  }
}

/* ------------------------------------------------------------
   HELPER PARA LLAMAR AL BACKEND
   - Agrega Authorization: Bearer <token> autom\u00e1ticamente
   - Si la respuesta es 401, cierra sesi\u00f3n y manda a login
   - Devuelve directamente el JSON parseado
   ------------------------------------------------------------ */
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
    throw new Error('Sesi\u00f3n expirada');
  }

  // Algunas respuestas (DELETE) pueden venir vac\u00edas
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

/* ------------------------------------------------------------
   SIDEBAR Y TOPBAR: pintar la marca, los enlaces seg\u00fan rol y
   el distintivo del usuario logueado.
   Para usarlo cada p\u00e1gina admin debe tener:
     <aside id="zona-sidebar"></aside>
     <header id="zona-topbar"></header>
   ------------------------------------------------------------ */
function pintarSidebar(paginaActiva) {
  const usuario = obtenerUsuario();
  if (!usuario) return;

  const rol = usuario.rol;

  // Definici\u00f3n de los enlaces del men\u00fa
  // Cada uno marca para qu\u00e9 roles est\u00e1 disponible
  const enlaces = [
    { id: 'dashboard',   archivo: 'dashboard.html',   icono: 'speedometer2', etiqueta: 'Dashboard',   roles: ['superadmin', 'admin_pais', 'editor'] },
    { id: 'noticias',    archivo: 'noticias.html',    icono: 'newspaper',    etiqueta: 'Noticias',    roles: ['superadmin', 'admin_pais', 'editor'] },
    { id: 'testimonios', archivo: 'testimonios.html', icono: 'chat-quote',   etiqueta: 'Testimonios', roles: ['superadmin', 'admin_pais', 'editor'] },
    { id: 'solicitudes', archivo: 'solicitudes.html', icono: 'envelope',     etiqueta: 'Solicitudes', roles: ['superadmin', 'admin_pais', 'editor'] },
    { id: 'usuarios',    archivo: 'usuarios.html',    icono: 'people',       etiqueta: 'Usuarios',    roles: ['superadmin'] }
  ];

  const enlacesPermitidos = enlaces.filter(enlace => enlace.roles.includes(rol));

  const htmlEnlaces = enlacesPermitidos.map(enlace => {
    const claseActivo = enlace.id === paginaActiva ? 'barra-lateral__enlace--activo' : '';
    return `
      <a href="${BASE_ADMIN}/${enlace.id}" class="barra-lateral__enlace ${claseActivo}">
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
            <span class="marca-argentina">Argentina</span>
            <span class="marca-comparte">Comparte</span>
          </div>
          <p class="barra-lateral__subtitulo">Panel administrativo</p>
        </div>

        <p class="barra-lateral__seccion-titulo">Men\u00fa</p>
        <nav class="barra-lateral__menu">
          ${htmlEnlaces}
        </nav>
      </aside>
    `;
  }
}

function pintarTopbar(tituloPagina) {
  const usuario = obtenerUsuario();
  if (!usuario) return;

  const nombrePais = usuario.pais?.nombre || 'Todos los pa\u00edses';

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
            Cerrar sesi\u00f3n
          </button>
        </div>
      </header>
    `;

    document.getElementById('boton-cerrar-sesion').addEventListener('click', cerrarSesion);
  }
}

/* ------------------------------------------------------------
   CERRAR SESI\u00d3N
   ------------------------------------------------------------ */
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

/* ------------------------------------------------------------
   MODALES: abrir y cerrar
   Espera un contenedor con id que apunte al modal.
   ------------------------------------------------------------ */
function abrirModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) modal.classList.add('fondo-modal--visible');
}

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) modal.classList.remove('fondo-modal--visible');
}

/* ------------------------------------------------------------
   FORMATEAR FECHAS para mostrar bonito en tablas
   ------------------------------------------------------------ */
function formatearFecha(fechaIso) {
  if (!fechaIso) return '\u2014';
  const fecha = new Date(fechaIso);
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/* ------------------------------------------------------------
   ROLES: helpers para revisar permisos en el cliente
   ------------------------------------------------------------ */
function usuarioEs(...rolesPermitidos) {
  const usuario = obtenerUsuario();
  return usuario && rolesPermitidos.includes(usuario.rol);
}
