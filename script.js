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

// Hamburger menu toggle (mobile only)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger?.addEventListener('click', () => {
  const isActive = navMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
});

// Links and sections
const links = document.querySelectorAll('.nav-link');
const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href')));

// Dynamically match header height for scroll behavior and highlighting
function updateHeaderOffset() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const headerHeight = header.offsetHeight;

  // Ensure native scrolling accounts for sticky header
  root.style.scrollPaddingTop = `${headerHeight}px`;

  // Ensure each section avoids being hidden under the header
  sections.forEach(sec => {
    if (sec) sec.style.scrollMarginTop = `${headerHeight}px`;
  });

  // Re-run highlight to reflect any changes
  onScroll();
}

// Active nav link on scroll using measured header height
function onScroll() {
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 0;
  const y = window.scrollY + headerHeight;
  let activeIndex = 0;

  sections.forEach((sec, i) => {
    if (!sec) return;
    if (sec.offsetTop <= y) activeIndex = i;
  });

  links.forEach((l, i) => l.classList.toggle('active', i === activeIndex));
}

document.addEventListener('scroll', onScroll);
window.addEventListener('load', updateHeaderOffset);
window.addEventListener('resize', updateHeaderOffset);

// Smooth navigation + immediate highlight + close mobile menu on click
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);

    // Native smooth scroll respects scroll-padding-top and scroll-margin-top
    target?.scrollIntoView({ behavior: 'smooth' });

    // Immediately set active state
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Close overlay menu after navigating (mobile)
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
