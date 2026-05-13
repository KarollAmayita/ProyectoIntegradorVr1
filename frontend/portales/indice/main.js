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
