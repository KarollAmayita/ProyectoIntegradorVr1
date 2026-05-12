/* ============================================================
   PORTAL ARGENTINA COMPARTE - Lógica del portal público
   - Carga testimonios y noticias (datos quemados por ahora)
   - Envía el formulario de contacto al backend real

   Convenciones que usamos en este archivo:
   - Las variables y funciones están en inglés (código).
   - Los comentarios están en español (para que sea fácil de explicar).
   - Los textos que ve el usuario están en español.
   - Cuando armamos el cuerpo que se envía al backend, las CLAVES
     se mantienen en español (pais_id, nombre, correo, telefono...)
     porque así las espera el backend; el resto del código es inglés.
   ============================================================ */

/* ------------------------------------------------------------
   CONFIGURACIÓN: cambiar estos valores si varía el backend
   o si el ID del país Argentina cambia en la base de datos.
   ------------------------------------------------------------ */
const BACKEND_URL = 'http://localhost:3001/api';
const ARGENTINA_COUNTRY_ID = 4;
// NOTA: el seed actual del SQL crea Colombia (id 1), Chile (id 2)
// y Ecuador (id 3). Cuando se agregue Argentina, será id 4.
// Si en el seed se reemplaza Colombia por Argentina, cambiar a 1.

/* ------------------------------------------------------------
   DATOS QUEMADOS (mock): testimonios y noticias del portal
   Más adelante se reemplazarán por llamadas a:
     GET /api/testimonials/public/argentina
     GET /api/news/public/argentina
   ------------------------------------------------------------ */
const testimonialsMock = [
  {
    quote: '"En el corazón de La Matanza, la solidaridad es el motor que nos permite construir comedores y espacios de estudio."',
    authorName: 'Mariela Sosa',
    authorRole: 'Buenos Aires',
    avatar: '../../../assets/img/argentina/mujer.png'
  },
  {
    quote: '"Llevamos educación digital a las escuelas rurales de la Patagonia. Argentina Comparte hizo que la distancia no sea una barrera."',
    authorName: 'Javier Ortiz',
    authorRole: 'Proyecto Conectividad Sur',
    avatar: '../../../assets/img/argentina/hombre.png',
    sideImage: '../../../assets/img/argentina/escuela_argentina.jpg'
  }
];

const newsMock = [
  {
    category: 'EDUCACIÓN',
    title: 'Inauguración de la nueva Biblioteca Popular en Córdoba',
    summary: 'Sumamos un espacio cultural para acercar la lectura a más de mil familias cordobesas.',
    date: '15 de Mayo, 2026',
    image: '../../../assets/img/argentina/biblioteca_cordoba.jpg'
  },
  {
    category: 'SUSTENTABILIDAD',
    title: 'Rosario se planta: iniciativa de huertas urbanas',
    summary: 'Sumamos 20 huertas que ya están produciendo alimentos para barrios populares de Argentina.',
    date: '08 de Mayo, 2026',
    image: '../../../assets/img/argentina/huerto.jpg'
  },
  {
    category: 'TECNOLOGÍA',
    title: 'Becas de Programación en Mendoza',
    summary: 'Lanzamos 50 becas de Argentina Comparte para jóvenes de zonas rurales.',
    date: '02 de Mayo, 2026',
    image: '../../../assets/img/argentina/becas.jpg'
  }
];

/* ------------------------------------------------------------
   FUNCIÓN: pintar los testimonios dentro de la grilla
   ------------------------------------------------------------ */
function printTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  let html = '';

  testimonialsMock.forEach((testimonial, index) => {
    // El primer testimonio es la tarjeta pequeña.
    // El segundo es la tarjeta ancha con imagen al costado.
    if (index === 0) {
      html += `
        <article class="testimonial-card">
          <div class="testimonial-card__quote-icon">"</div>
          <p class="testimonial-card__quote">${testimonial.quote}</p>
          <div class="testimonial-card__author">
            <div class="testimonial-card__avatar">
              <img src="${testimonial.avatar}" alt="${testimonial.authorName}" />
            </div>
            <div>
              <p class="testimonial-card__name">${testimonial.authorName}</p>
              <p class="testimonial-card__role">${testimonial.authorRole}</p>
            </div>
          </div>
        </article>
      `;
    } else {
      html += `
        <article class="testimonial-card testimonial-card--wide">
          <div class="testimonial-card__content">
            <div class="testimonial-card__quote-icon">"</div>
            <p class="testimonial-card__quote">${testimonial.quote}</p>
            <div class="testimonial-card__author">
              <div class="testimonial-card__avatar">
                <img src="${testimonial.avatar}" alt="${testimonial.authorName}" />
              </div>
              <div>
                <p class="testimonial-card__name">${testimonial.authorName}</p>
                <p class="testimonial-card__role">${testimonial.authorRole}</p>
              </div>
            </div>
          </div>
          <img class="testimonial-card__image" src="${testimonial.sideImage}" alt="Imagen del testimonio" />
        </article>
      `;
    }
  });

  container.innerHTML = html;
}

/* ------------------------------------------------------------
   FUNCIÓN: pintar las noticias dentro de la grilla
   ------------------------------------------------------------ */
function printNews() {
  const container = document.getElementById('news-container');
  if (!container) return;

  const html = newsMock.map(news => `
    <article class="news-card">
      <img class="news-card__image" src="${news.image}" alt="${news.title}" />
      <div class="news-card__body">
        <span class="news-card__category">${news.category}</span>
        <h3 class="news-card__title">${news.title}</h3>
        <p class="news-card__summary">${news.summary}</p>
        <p class="news-card__date">
          <i class="bi bi-calendar3"></i>
          ${news.date}
        </p>
      </div>
    </article>
  `).join('');

  container.innerHTML = html;
}

/* ------------------------------------------------------------
   FUNCIÓN: enviar el formulario de contacto al backend
   POST /api/contact-requests/public

   IMPORTANTE: las claves del JSON que se envía (pais_id, nombre,
   correo, telefono, finalidad, mensaje) están en español porque
   así las espera el backend. El resto del código sigue en inglés.
   ------------------------------------------------------------ */
async function sendContactForm(event) {
  event.preventDefault();

  const form = event.target;
  const sendButton = document.getElementById('send-button');
  const successBox = document.getElementById('success-message');
  const errorBox = document.getElementById('error-message');

  // Ocultar mensajes anteriores
  successBox.hidden = true;
  errorBox.hidden = true;

  // Leemos los valores escritos por el usuario (variables en inglés)
  const userName = form.userName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const purpose = form.purpose.value;
  const message = form.message.value.trim() || null;

  // Validaciones básicas del lado del cliente
  if (!userName || !email || !phone || !purpose) {
    showError('Por favor completá todos los campos obligatorios.');
    return;
  }

  if (!isValidEmail(email)) {
    showError('El correo electrónico no tiene un formato válido.');
    return;
  }

  // Armamos el cuerpo que viaja al backend.
  // Las CLAVES van en español porque así están definidas en el backend.
  const payload = {
    pais_id: ARGENTINA_COUNTRY_ID,
    nombre: userName,
    correo: email,
    telefono: phone,
    finalidad: purpose,
    mensaje: message
  };

  // Bloqueamos el botón mientras viaja la petición
  sendButton.disabled = true;
  sendButton.textContent = 'ENVIANDO...';

  try {
    const response = await fetch(`${BACKEND_URL}/contact-requests/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message || 'No se pudo enviar la solicitud');
    }

    // Éxito: limpiamos el formulario y mostramos el mensaje
    form.reset();
    successBox.textContent = '¡Mensaje enviado! Pronto nos pondremos en contacto.';
    successBox.hidden = false;
  } catch (error) {
    showError(error.message);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'ENVIAR MENSAJE';
  }
}

/* ------------------------------------------------------------
   FUNCIÓN: verificar que un correo tenga forma válida
   Un correo válido es del estilo:  algo@algo.algo
   Ejemplo bueno: maria@gmail.com
   Ejemplos malos: maria, maria@gmail, @gmail.com, "ma ria@gmail.com"
   ------------------------------------------------------------ */
function isValidEmail(email) {
  // Regla 1: no puede tener espacios
  if (email.includes(' ')) {
    return false;
  }

  // Regla 2: tiene que tener exactamente UN símbolo @
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const beforeAt = parts[0];
  const afterAt = parts[1];

  // Regla 3: antes del @ tiene que haber algo escrito
  if (beforeAt.length === 0) {
    return false;
  }

  // Regla 4: después del @ tiene que haber un punto (para el dominio)
  if (!afterAt.includes('.')) {
    return false;
  }

  // Regla 5: después del último punto tiene que haber al menos una letra
  const domainParts = afterAt.split('.');
  const lastPart = domainParts[domainParts.length - 1];
  if (lastPart.length === 0) {
    return false;
  }

  return true;
}

/* ------------------------------------------------------------
   FUNCIÓN: mostrar un mensaje de error dentro del formulario
   ------------------------------------------------------------ */
function showError(message) {
  const errorBox = document.getElementById('error-message');
  errorBox.textContent = message;
  errorBox.hidden = false;
}

/* ------------------------------------------------------------
   PUNTO DE ARRANQUE: cuando carga la página, ejecuta todo
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  printTestimonials();
  printNews();

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', sendContactForm);
  }
});
