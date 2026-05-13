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
const observer = new IntersectionObserver(entries => {
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
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => observer.observe(c));

// Scroll reveal animation
const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .about__content, .impact__grid, .news__grid, .contact__block, .footer__content');
revealElements.forEach(el => {
  el.classList.add('animate-on-scroll');
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.classList.add('visible');
      obs.unobserve(el);
    }
  }, { threshold: 0.1 });
  obs.observe(el);
});

// Contact form
document.getElementById('contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('.contact__submit');
  const original = btn.textContent;
  btn.textContent = 'ENVIANDO...';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1000));
  btn.textContent = '¡MENSAJE ENVIADO!';
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    e.target.reset();
  }, 3000);
});
