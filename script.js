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

// Dynamically match header height for native scroll behavior
function updateHeaderOffset() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const headerHeight = header.offsetHeight;

  // Native behavior: ensure sticky header doesn't cover targets
  root.style.scrollPaddingTop = `${headerHeight}px`;
  sections.forEach(sec => {
    if (sec) sec.style.scrollMarginTop = `${headerHeight}px`;
  });

  // Recompute highlight after any layout change
  onScroll();
}

// Persistent highlight control
let manualActive = null;   // nav link element last clicked by user
let scrollTimeout = null;  // timer to re-enable auto highlight after scroll settles

// Smooth navigation + immediate, persistent highlight + close mobile menu
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);

    // Smooth scroll (respects scroll-padding/margin)
    target?.scrollIntoView({ behavior: 'smooth' });

    // Immediate highlight
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Remember manual selection to prevent auto override
    manualActive = link;

    // Close overlay menu (mobile)
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    }

    // Give smooth scroll time before auto highlight resumes
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      manualActive = null; // allow auto highlight again
      onScroll();          // sync active state after scroll ends
    }, 500); // tweak if needed based on scroll duration
  });
});

// Auto highlight on scroll using measured header height
function onScroll() {
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 0;
  const y = window.scrollY + headerHeight;
  let activeIndex = 0;

  sections.forEach((sec, i) => {
    if (!sec) return;
    if (sec.offsetTop <= y) activeIndex = i;
  });

  // Only auto-update if user hasn't just clicked
  if (!manualActive) {
    links.forEach((l, i) => l.classList.toggle('active', i === activeIndex));
  }
}

// Scroll handling (debounced)
document.addEventListener('scroll', () => {
  onScroll();
  // If user scrolls manually, re-enable auto highlight after settle
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    manualActive = null;
    onScroll();
  }, 200);
});

window.addEventListener('load', updateHeaderOffset);
window.addEventListener('resize', updateHeaderOffset);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
