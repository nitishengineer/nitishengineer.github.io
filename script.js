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

// Active nav link on scroll
const links = document.querySelectorAll('.nav-link');
const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href')));

function onScroll() {
  const headerOffset = 150; // match your CSS scroll-padding-top
  const y = window.scrollY + headerOffset;
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    if (!sec) return;
    if (sec.offsetTop <= y) activeIndex = i;
  });
  links.forEach((l, i) => l.classList.toggle('active', i === activeIndex));
}
document.addEventListener('scroll', onScroll);

// Smooth navigation
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    // Immediately update active link when clicked
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
