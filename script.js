// Theme toggle with localStorage
const root = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

function setTheme(mode) {
  if (mode === 'light') root.classList.add('light');
  else root.classList.remove('light');
  localStorage.setItem('theme', mode);
}
setTheme(savedTheme || 'dark');

toggleBtn?.addEventListener('click', () => {
  const next = root.classList.contains('light') ? 'dark' : 'light';
  setTheme(next);
});

// Hamburger menu toggle (overlay on mobile)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger?.addEventListener('click', () => {
  const isActive = navMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
});

// Active nav link on scroll (keep in sync with CSS scroll-padding-top)
const links = document.querySelectorAll('.nav-link');
const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href')));

function onScroll() {
  // Desktop: 120px, Mobile: 80px — detect via viewport width
  const headerOffset = window.innerWidth <= 600 ? 80 : 120;
  const y = window.scrollY + headerOffset;
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    if (!sec) return;
    if (sec.offsetTop <= y) activeIndex = i;
  });
  links.forEach((l, i) => l.classList.toggle('active', i === activeIndex));
}
document.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);
window.addEventListener('resize', onScroll);

// Smooth navigation + immediate highlight + close mobile menu on click
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

    // Immediately set active state
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Close overlay menu after navigating (mobile)
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
