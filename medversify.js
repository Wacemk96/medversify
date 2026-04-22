/* ═══════════════════════════════════════════════
   MedVersify Landing Page — JavaScript
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL ── */
  const nav = document.querySelector('.site-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── FADE-UP INTERSECTION OBSERVER ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ── KPI COUNTER ANIMATION ── */
  function animateCounter(el) {
    const raw = el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isFloat = raw.includes('.');
    const target = parseFloat(raw);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + raw + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.kpi-count').forEach(el => counterObserver.observe(el));

  /* ── HERO SLIDER ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let current = 0;
  let timer = null;
  let paused = false;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => { if (!paused) goTo(current + 1); }, 5000);
  }

  document.querySelector('.hero-prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.hero-next')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  const heroSection = document.querySelector('.hero');
  heroSection?.addEventListener('mouseenter', () => paused = true);
  heroSection?.addEventListener('mouseleave', () => paused = false);

  goTo(0);
  startAuto();

  /* ── RECOVERY BAR ANIMATION ── */
  const recoveryFill = document.querySelector('.recovery-fill');
  const recoveryPct = document.querySelector('.recovery-pct');
  const recoveryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          if (recoveryFill) recoveryFill.style.width = '98%';
          if (recoveryPct) {
            let n = 60;
            const iv = setInterval(() => {
              n = Math.min(n + 1.5, 98);
              recoveryPct.textContent = Math.round(n) + '%';
              if (n >= 98) clearInterval(iv);
            }, 40);
          }
          // Stagger alert cards
          document.querySelectorAll('.alert-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('show'), 800 + i * 400);
          });
        }, 300);
        recoveryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  if (recoveryFill) recoveryObserver.observe(recoveryFill.closest('.browser-frame'));

  /* ── HOW IT WORKS CONNECTOR ── */
  const connectorFill = document.querySelector('.hiw-connector-fill');
  const connectorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          if (connectorFill) connectorFill.style.width = '100%';
        }, 200);
        connectorObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  if (connectorFill) connectorObserver.observe(connectorFill.closest('.hiw-section'));

  /* ── STAGGER FADE-UP CHILDREN ── */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.querySelectorAll('.fade-up');
    children.forEach((child, i) => {
      child.dataset.delay = i * 80;
    });
  });

  /* ── FORM SUBMIT ── */
  document.querySelector('.audit-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.textContent = '✓ Request Submitted!';
    btn.style.background = 'var(--green)';
    btn.disabled = true;
  });

});
