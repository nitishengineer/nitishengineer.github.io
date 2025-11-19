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
  setTheme(root.classList.contains('light') ? 'dark' : 'light');
});

// Hamburger toggle (mobile)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
hamburger?.addEventListener('click', () => {
  const isActive = navMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
});

// Navigation links and sections
const links = Array.from(document.querySelectorAll('.nav-link'));
const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

// Ensure CSS scroll-padding-top and per-section scroll-margin-top match header height
function syncHeaderOffsets() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const h = header.offsetHeight;
  root.style.scrollPaddingTop = `${h}px`;
  sections.forEach(s => { s.style.scrollMarginTop = `${h}px`; });
}
window.addEventListener('load', syncHeaderOffsets);
window.addEventListener('resize', syncHeaderOffsets);

// Simplified scroll highlight logic using visible viewport position
function onScroll() {
  const y = window.scrollY;
  let activeIndex = 0;
  // find the last section whose top is <= y + small buffer
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    if (!sec) continue;
    if (sec.getBoundingClientRect().top + window.scrollY <= y + 10) activeIndex = i;
    else break;
  }
  links.forEach((lnk, i) => lnk.classList.toggle('active', i === activeIndex));
}
document.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

// Click handlers: smooth scroll only (no manual override needed)
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Close mobile overlay if open
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    }

    // Mark clicked link active immediately for responsiveness
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // After a short delay, run onScroll to sync with actual position
    setTimeout(onScroll, 500);
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
