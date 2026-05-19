// Scroll progress bar
const progressBar = document.getElementById('scroll-progress');
// Back to top
const backToTop = document.getElementById('back-to-top');
// Navbar
const navbar = document.querySelector('.navbar');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
  backToTop.classList.toggle('visible', scrollTop > 500);
  navbar.classList.toggle('navbar--scrolled', scrollTop > 50);
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Back to top click
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile menu toggle
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.navbar__menu').classList.toggle('navbar__menu--open');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.querySelector('.navbar__menu')?.classList.remove('navbar__menu--open');
  });
});

// Animated counters
const counters = document.querySelectorAll('.impact__number');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const increment = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 40);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

const API_BASE = '/api';

// Cargar últimas noticias desde la API
async function cargarNoticias() {
  const container = document.querySelector('.news__grid');
  if (!container) return;
  try {
    const paises = ['argentina', 'chile', 'colombia', 'ecuador'];
    const todas = await Promise.all(
      paises.map(slug =>
        fetch(`${API_BASE}/news/public/${slug}`)
          .then(r => r.ok ? r.json() : [])
          .then(d => (Array.isArray(d) ? d : d?.data || []))
          .catch(() => [])
      )
    );
    const noticias = todas.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
    if (noticias.length === 0) return;
    container.innerHTML = noticias.map((n, i) => `
      <article class="news__card reveal" style="transition-delay:${0.15 + i * 0.15}s">
        <div class="news__card-img">
          <img src="${n.imagen_principal_url || '../../../assets/img/argentina/biblioteca_cordoba.jpg'}" alt="${n.titulo}" loading="lazy" />
        </div>
        <div class="news__card-body">
          <span class="news__card-tag">${n.paises?.nombre || 'Actualidad'}</span>
          <h3>${n.titulo}</h3>
          <p>${n.resumen}</p>
        </div>
      </article>
    `).join('');
  } catch (e) {
    console.error('Error cargando noticias:', e);
  }
}

// Contact form → API
document.getElementById('contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('.contact__submit');
  const original = btn.textContent;
  const inputs = e.target.querySelectorAll('input, select, textarea');
  const payload = {
    nombre: inputs[0].value.trim(),
    apellido: inputs[1]?.value?.trim() || '',
    telefono: inputs[2]?.value?.trim() || '',
    finalidad: 'Servicio',
    mensaje: inputs[6]?.value?.trim() || '',
    correo: inputs[5]?.value?.trim() || '',
    pais_id: null,
  };
  const paisSel = inputs[3]?.value;
  if (paisSel && paisSel !== 'Otro' && paisSel !== '') {
    try {
      const res = await fetch(`${API_BASE}/countries/active`);
      const paises = await res.json();
      const lista = Array.isArray(paises) ? paises : paises?.data || [];
      const found = lista.find(p => p.nombre === paisSel);
      if (found) payload.pais_id = found.id;
    } catch {}
  }
  btn.textContent = 'ENVIANDO...';
  btn.disabled = true;
  try {
    const resp = await fetch(`${API_BASE}/contact-requests/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error('Error al enviar');
    btn.textContent = '¡MENSAJE ENVIADO!';
    setTimeout(() => { btn.textContent = original; btn.disabled = false; e.target.reset(); }, 3000);
  } catch {
    btn.textContent = 'ERROR - INTENTA DE NUEVO';
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
  }
});

cargarNoticias();
