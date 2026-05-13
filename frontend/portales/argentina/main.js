const BACKEND_URL = '/api';
const ARGENTINA_COUNTRY_ID = 2;
const COUNTRY_SLUG = 'argentina';

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

async function loadTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  try {
    const res = await fetch(`${BACKEND_URL}/testimonials/public/${COUNTRY_SLUG}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (!data || data.length === 0) throw new Error('No data');
    renderTestimonials(data.map(t => ({
      quote: `"${t.contenido}"`,
      authorName: t.nombre,
      authorRole: t.cargo || t.empresa || '',
      avatar: t.foto_url || '../../../assets/img/argentina/mujer.png',
      sideImage: null
    })));
  } catch {
    renderTestimonials(testimonialsMock);
  }
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
              <img src="${testimonial.avatar}" alt="${testimonial.authorName}" />
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
                <img src="${testimonial.avatar}" alt="${testimonial.authorName}" />
              </div>
              <div>
                <p class="testimonial-card__name">${testimonial.authorName}</p>
                <p class="testimonial-card__role">${testimonial.authorRole}</p>
              </div>
            </div>
          </div>
          <img class="testimonial-card__image" src="${testimonial.sideImage}" alt="Imagen del testimonio" />
        </article>`;
    }
  });

  container.innerHTML = html;
}

async function loadNews() {
  const container = document.getElementById('news-container');
  if (!container) return;

  try {
    const res = await fetch(`${BACKEND_URL}/news/public/${COUNTRY_SLUG}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (!data || data.length === 0) throw new Error('No data');
    renderNews(data.map(n => ({
      category: '',
      title: n.titulo,
      summary: n.resumen,
      date: formatDate(n.fecha_publicacion),
      image: n.imagen_principal_url || '../../../assets/img/argentina/biblioteca_cordoba.jpg',
      slug: n.slug
    })));
  } catch {
    renderNews(newsMock);
  }
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderNews(list) {
  const container = document.getElementById('news-container');
  const html = list.map(news => `
    <article class="news-card">
      <img class="news-card__image" src="${news.image}" alt="${news.title}" loading="lazy" />
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

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
    link.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initNewsletter() {
  const form = document.querySelector('.footer__newsletter');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const email = input.value.trim();
    if (!email) return;
    const btn = form.querySelector('button');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg"></i>';
    input.value = '';
    input.placeholder = '¡Gracias por suscribirte!';
    setTimeout(() => {
      input.placeholder = 'tu@email.com';
      btn.innerHTML = original;
    }, 3000);
  });
}

async function sendTestimonialForm(event) {
  event.preventDefault();

  const form = event.target;
  const sendButton = document.getElementById('send-button');
  const successBox = document.getElementById('success-message');
  const errorBox = document.getElementById('error-message');

  successBox.hidden = true;
  errorBox.hidden = true;

  const userName = form.userName.value.trim();
  const role = form.role.value.trim() || null;
  const company = form.company.value.trim() || null;
  const content = form.content.value.trim();
  const photoUrl = form.photoUrl.value.trim() || null;
  const instagram = form.instagram.value.trim() || null;
  const facebook = form.facebook.value.trim() || null;

  if (!userName || !content) {
    showError('Por favor completá tu nombre y tu testimonio.');
    return;
  }

  const payload = {
    pais_id: ARGENTINA_COUNTRY_ID,
    nombre: userName,
    cargo: role,
    empresa: company,
    contenido: content,
    foto_url: photoUrl,
    instagram_url: instagram,
    facebook_url: facebook
  };

  sendButton.disabled = true;
  sendButton.textContent = 'ENVIANDO...';

  try {
    const response = await fetch(`${BACKEND_URL}/testimonials/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message || 'No se pudo enviar el testimonio');
    }

    form.reset();
    successBox.textContent = '¡Testimonio enviado! Gracias por compartir tu experiencia.';
    successBox.hidden = false;
  } catch (error) {
    showError(error.message);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'ENVIAR TESTIMONIO';
  }
}

function showError(message) {
  const errorBox = document.getElementById('error-message');
  errorBox.textContent = message;
  errorBox.hidden = false;
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

  if (!query) {
    resultsContainer.hidden = true;
    return;
  }

  const allContent = [
    ...newsMock.map(n => ({ type: 'noticia', title: n.title, text: n.summary, category: n.category })),
    ...testimonialsMock.map(t => ({ type: 'testimonio', title: t.authorName, text: t.quote.replace(/['"]+/g, ''), category: t.authorRole }))
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

  const highlight = (text, term) => {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  resultsContainer.innerHTML = matches.map(item => `
    <div class="search-bar__result-item">
      <strong>${highlight(item.title, query)}</strong>
      <span style="font-size:12px;color:var(--gray-text);margin-left:8px">${item.type}</span>
      <p style="font-size:13px;margin-top:4px;color:var(--gray-text)">${highlight(item.text.substring(0, 120), query)}${item.text.length > 120 ? '...' : ''}</p>
    </div>
  `).join('');
  resultsContainer.hidden = false;
}

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
