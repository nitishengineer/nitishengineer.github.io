// Theme toggle
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
  setTheme(root.classList.contains('light') ? 'dark' : 'light');
});

// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
hamburger?.addEventListener('click', () => {
  const isActive = navMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
});

// Nav links
const links = document.querySelectorAll('.nav-link');
const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href')));

// --- Highlight logic ---
let manualActive = null; // track clicked link
let scrollTimer = null;

function onScroll() {
  if (manualActive) return; // skip auto highlight during manual scroll

  const headerHeight = document.querySelector('.site-header').offsetHeight;
  const y = window.scrollY + headerHeight;
  let activeIndex = 0;

  sections.forEach((sec, i) => {
    if (!sec) return;
    if (sec.offsetTop <= y) activeIndex = i;
  });

  links.forEach((l, i) => l.classList.toggle('active', i === activeIndex));
}

document.addEventListener('scroll', () => {
  onScroll();
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    manualActive = null; // re‑enable auto highlight after scroll settles
    onScroll();
  }, 400); // adjust delay if needed
});

// Click handler
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);

    // Smooth scroll
    target?.scrollIntoView({ behavior: 'smooth' });

    // Immediate highlight
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    manualActive = link;

    // Close mobile menu
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
