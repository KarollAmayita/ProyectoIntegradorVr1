// ============================================================
//  PORTAL ECUADOR COMPARTE - main.js
//  Lógica: testimonios, noticias, búsqueda, formulario
// ============================================================

const BACKEND_URL = '/api';
const ECUADOR_COUNTRY_ID = 3;     // Ecuador es el tercer país en la BD
const COUNTRY_SLUG = 'ecuador';

// ------------------------------------------------------------
//  DATOS DE PRUEBA (mock)
//  Se usan si el backend no está disponible.
//  Agrega tus imágenes en: assets/img/ecuador/
// ------------------------------------------------------------
const testimonialsMock = [
  {
    quote: '"En Guayaquil aprendimos que el cambio empieza por compartir..."',
    authorName: 'Valeria Moreno',
    authorRole: 'Guayaquil',
    avatar: '../../assets/img/ecuador/testimujer2.jpeg'        
  },
  {
    quote: '"Llevamos kits escolares a comunidades amazónicas de Napo..."',
    authorName: 'Diego Salazar',
    authorRole: 'Proyecto Amazonía Viva',
    avatar: '../../assets/img/ecuador/testimonioHombre.png',  
    sideImage: '../../assets/img/ecuador/recursos.jpg'         
  }
];

const newsMock = [
  {
    category: 'MEDIO AMBIENTE',
    title: 'Reforestación en la reserva Cayambe-Coca suma 2.000 árboles',
    summary: 'Voluntarios de Ecuador Comparte recuperan zonas afectadas por la deforestación en la sierra norte.',
    date: '10 de Mayo, 2026',
    image: '../../assets/img/ecuador/reforestacion.jpg'    
  },
  {
    category: 'EDUCACIÓN',
    title: 'Talleres de robótica llegan a escuelas rurales de Loja',
    summary: 'Ecuador Comparte capacita a 300 estudiantes en tecnología y pensamiento computacional.',
    date: '03 de Mayo, 2026',
    image: '../../assets/img/ecuador/tallerrobotica.png'      
  },
  {
    category: 'CULTURA',
    title: 'Festival de arte comunitario en Cuenca reúne a 500 familias',
    summary: 'La iniciativa promueve la identidad cultural y el trabajo colectivo en el centro histórico.',
    date: '25 de Abril, 2026',
    image: '../../assets/img/ecuador/cuenca.jpg'            
  }
];

// ------------------------------------------------------------
//  CARGA DE TESTIMONIOS
// ------------------------------------------------------------
function loadTestimonials() {
  renderTestimonials(testimonialsMock);
}

function renderTestimonials(list) {
  const container = document.getElementById('testimonials-container');
  let html = '';

  list.forEach((testimonial, index) => {
    if (index === 0 || !testimonial.sideImage) {
      html += `
        <article class="testimonial-card">
          <div class="testimonial-card__quote-icon">"</div>
          <p class="testimonial-card__quote">${testimonial.quote}</p>
          <div class="testimonial-card__author">
            <div class="testimonial-card__avatar">
              <img src="${testimonial.avatar}" alt="${testimonial.authorName}"
                onerror="this.style.display='none'; this.parentElement.textContent='${testimonial.authorName.charAt(0)}'" />
            </div>
            <div>
              <p class="testimonial-card__name">${testimonial.authorName}</p>
              <p class="testimonial-card__role">${testimonial.authorRole}</p>
            </div>
          </div>
        </article>`;
    } else {
      html += `
        <article class="testimonial-card testimonial-card--wide">
          <div class="testimonial-card__content">
            <div class="testimonial-card__quote-icon">"</div>
            <p class="testimonial-card__quote">${testimonial.quote}</p>
            <div class="testimonial-card__author">
              <div class="testimonial-card__avatar">
                <img src="${testimonial.avatar}" alt="${testimonial.authorName}"
                  onerror="this.style.display='none'; this.parentElement.textContent='${testimonial.authorName.charAt(0)}'" />
              </div>
              <div>
                <p class="testimonial-card__name">${testimonial.authorName}</p>
                <p class="testimonial-card__role">${testimonial.authorRole}</p>
              </div>
            </div>
          </div>
          <img class="testimonial-card__image" src="${testimonial.sideImage}" alt="Imagen del testimonio"
            onerror="this.style.background='var(--ec-blue-light)'; this.src=''" />
        </article>`;
    }
  });

  container.innerHTML = html;
}

// ------------------------------------------------------------
//  CARGA DE NOTICIAS
// ------------------------------------------------------------
function loadNews() {
  renderNews(newsMock);
}

function renderNews(list) {
  const container = document.getElementById('news-container');
  const placeholderColors = ['#E0E9FF', '#FFFBDD', '#FDECEA'];

  const html = list.map((news, i) => `
    <article class="news-card">
      <img class="news-card__image" src="${news.image}" alt="${news.title}" loading="lazy"
        onerror="this.style.display='none'; this.parentElement.insertAdjacentHTML('afterbegin',
          '<div style=\'height:180px;background:${placeholderColors[i % 3]};display:flex;align-items:center;justify-content:center;font-size:40px;color:var(--ec-blue)\'><i class=\'bi bi-newspaper\'></i></div>')" />
      <div class="news-card__body">
        ${news.category ? `<span class="news-card__category">${news.category}</span>` : ''}
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

// ------------------------------------------------------------
//  FORMULARIO DE TESTIMONIO
// ------------------------------------------------------------
async function sendTestimonialForm(event) {
  event.preventDefault();

  const form = event.target;
  const sendButton = document.getElementById('send-button');
  const successBox = document.getElementById('success-message');
  const errorBox   = document.getElementById('error-message');

  successBox.hidden = true;
  errorBox.hidden   = true;

  const userName  = form.userName.value.trim();
  const role      = form.role.value.trim() || null;
  const company   = form.company.value.trim() || null;
  const content   = form.content.value.trim();
  const photoUrl  = form.photoUrl.value.trim() || null;
  const instagram = form.instagram.value.trim() || null;
  const facebook  = form.facebook.value.trim() || null;

  if (!userName || !content) {
    showError('Por favor completa tu nombre y tu testimonio.');
    return;
  }

  const payload = {
    pais_id:       ECUADOR_COUNTRY_ID,
    nombre:        userName,
    cargo:         role,
    empresa:       company,
    contenido:     content,
    foto_url:      photoUrl,
    instagram_url: instagram,
    facebook_url:  facebook
  };

  sendButton.disabled    = true;
  sendButton.textContent = 'ENVIANDO...';

  try {
    const response = await fetch(`${BACKEND_URL}/testimonials/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.message || 'No se pudo enviar el testimonio');

    form.reset();
    successBox.textContent = '¡Testimonio enviado! Gracias por compartir tu experiencia con Ecuador Comparte.';
    successBox.hidden = false;
  } catch (error) {
    showError(error.message);
  } finally {
    sendButton.disabled    = false;
    sendButton.textContent = 'ENVIAR TESTIMONIO';
  }
}

function showError(message) {
  const errorBox = document.getElementById('error-message');
  errorBox.textContent = message;
  errorBox.hidden = false;
}

// ------------------------------------------------------------
//  FUNCIONES DE UI
// ------------------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initSeeAllNews() {
  const link = document.querySelector('.see-all-link');
  if (!link) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    const grid = document.getElementById('news-container');
    const allHidden = grid.querySelectorAll('.news-card.hidden');
    if (allHidden.length > 0) {
      allHidden.forEach(c => c.classList.remove('hidden'));
      link.innerHTML = 'Mostrar menos <i class="bi bi-arrow-up"></i>';
    } else {
      const cards = grid.querySelectorAll('.news-card');
      if (cards.length > 3) {
        cards.forEach((c, i) => { if (i >= 3) c.classList.add('hidden'); });
        link.innerHTML = 'Ver todas las noticias <i class="bi bi-arrow-right"></i>';
      }
    }
  });
}

function initFooterLinks() {
  document.querySelectorAll('.footer__social a').forEach(link => {
    const label = link.getAttribute('aria-label');
    const urls = { Facebook: 'https://facebook.com', Instagram: 'https://instagram.com', Twitter: 'https://x.com' };
    if (urls[label]) link.href = urls[label];
    link.target = '_blank';
    link.rel = 'noopener';
  });
  document.querySelectorAll('.footer__list a').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  });
}

function initNewsletter() {
  const form = document.querySelector('.footer__newsletter');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (!input.value.trim()) return;
    const btn = form.querySelector('button');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg"></i>';
    input.value = '';
    input.placeholder = '¡Gracias por suscribirte!';
    setTimeout(() => { input.placeholder = 'tu@email.com'; btn.innerHTML = original; }, 3000);
  });
}

function sharePage() {
  const url = window.location.href;
  const title = document.title;
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.querySelector('.icon-button[aria-label="Compartir"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg"></i>';
      setTimeout(() => { btn.innerHTML = original; }, 2000);
    }).catch(() => {});
  }
}

function toggleSearch() {
  const searchBar = document.getElementById('search-bar');
  const isHidden = searchBar.hidden;
  searchBar.hidden = !isHidden;
  if (!isHidden) {
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').hidden = true;
  } else {
    document.getElementById('search-input').focus();
  }
}

function performSearch() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  const resultsContainer = document.getElementById('search-results');

  if (!query) { resultsContainer.hidden = true; return; }

  const allContent = [
    ...newsMock.map(n => ({ type: 'noticia', title: n.title, text: n.summary, category: n.category })),
    ...testimonialsMock.map(t => ({ type: 'testimonio', title: t.authorName, text: t.quote.replace(/["]+/g, ''), category: t.authorRole }))
  ];

  const matches = allContent.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.text.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = '<p class="search-bar__result-empty">No se encontraron resultados</p>';
    resultsContainer.hidden = false;
    return;
  }

  const highlight = (text, term) => text.replace(new RegExp(`(${term})`, 'gi'), '<mark>$1</mark>');

  resultsContainer.innerHTML = matches.map(item => `
    <div class="search-bar__result-item">
      <strong>${highlight(item.title, query)}</strong>
      <span style="font-size:12px;color:var(--gray-text);margin-left:8px">${item.type}</span>
      <p style="font-size:13px;margin-top:4px;color:var(--gray-text)">${highlight(item.text.substring(0, 120), query)}${item.text.length > 120 ? '...' : ''}</p>
    </div>
  `).join('');
  resultsContainer.hidden = false;
}

// ------------------------------------------------------------
//  INICIALIZACIÓN
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadTestimonials();
  loadNews();
  initSmoothScroll();
  initSeeAllNews();
  initFooterLinks();
  initNewsletter();

  const form = document.getElementById('testimonial-form');
  if (form) form.addEventListener('submit', sendTestimonialForm);

  const searchButton = document.querySelector('.icon-button[aria-label="Buscar"]');
  if (searchButton) searchButton.addEventListener('click', toggleSearch);

  const shareButton = document.querySelector('.icon-button[aria-label="Compartir"]');
  if (shareButton) shareButton.addEventListener('click', sharePage);

  const searchClose = document.getElementById('search-close');
  if (searchClose) searchClose.addEventListener('click', toggleSearch);

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', performSearch);
});
