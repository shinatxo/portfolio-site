// Dynamic greeting based on local time
(function setGreeting() {
  const el = document.getElementById('dynamic-greeting');
  if (!el) return;
  const hour = new Date().getHours();
  let greeting;
  if (hour < 5)       greeting = 'Up late.';
  else if (hour < 12) greeting = 'Good morning.';
  else if (hour < 18) greeting = 'Good afternoon.';
  else                greeting = 'Good evening.';
  el.textContent = greeting;
})();

// Update footer year automatically
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// Reveal-on-scroll for cards and section heads
(function revealOnScroll() {
  const targets = document.querySelectorAll('.section-head, .card, .hero h1, .lede, .hero-actions');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }
  targets.forEach(t => t.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => io.observe(t));
})();

// Scrollspy: highlight the nav link for the currently-visible section
(function scrollspy() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!('IntersectionObserver' in window) || sections.length === 0 || links.length === 0) return;

  const linkFor = (id) => Array.from(links).find(a => a.getAttribute('href') === `#${id}`);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();
