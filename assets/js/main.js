/* ─── OpenForge Main JS ─── */

// ── Navbar scroll glass effect
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile menu toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', function(e) {
    if (!mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
  // Close menu when a nav link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// ── Dark / Light theme toggle
const themeToggle = document.getElementById('theme-toggle');
const iconMoon = document.getElementById('icon-moon');
const iconSun = document.getElementById('icon-sun');
const html = document.documentElement;

// Theme already applied to <html> by inline head script — just sync body classes and icons
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

function applyTheme(theme) {
  if (theme === 'light') {
    html.classList.add('light');
    html.setAttribute('data-theme', 'light');
    document.body.classList.remove('bg-zinc-950', 'text-zinc-100');
    document.body.classList.add('bg-zinc-50', 'text-zinc-900');
    if (iconMoon) iconMoon.classList.add('hidden');
    if (iconSun) iconSun.classList.remove('hidden');
  } else {
    html.classList.remove('light');
    html.setAttribute('data-theme', 'dark');
    document.body.classList.remove('bg-zinc-50', 'text-zinc-900');
    document.body.classList.add('bg-zinc-950', 'text-zinc-100');
    if (iconMoon) iconMoon.classList.remove('hidden');
    if (iconSun) iconSun.classList.add('hidden');
  }
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ── Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Auto-generate Table of Contents (for doc pages)
const tocContainer = document.getElementById('toc');
if (tocContainer) {
  const headings = document.querySelectorAll('article h2, article h3');
  if (headings.length > 2) {
    tocContainer.innerHTML = '<p class="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-3">On this page</p>';
    const ul = document.createElement('ul');
    ul.className = 'space-y-1.5';
    const seenSlugs = {};
    headings.forEach(h => {
      if (!h.id) {
        let base = h.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        seenSlugs[base] = (seenSlugs[base] || 0) + 1;
        h.id = seenSlugs[base] > 1 ? `${base}-${seenSlugs[base]}` : base;
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = `block text-xs text-zinc-500 hover:text-forge-400 transition-colors ${h.tagName === 'H3' ? 'pl-3' : ''}`;
      li.appendChild(a);
      ul.appendChild(li);
    });
    tocContainer.appendChild(ul);
    tocContainer.classList.remove('hidden');
  }
}

// ── Smooth anchor links offset (fixed navbar)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── Add copy buttons to code blocks
document.querySelectorAll('pre').forEach(pre => {
  const btn = document.createElement('button');
  btn.textContent = 'Copy';
  btn.className = 'absolute top-3 right-3 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-mono rounded-lg transition-colors opacity-0 group-hover:opacity-100';
  pre.classList.add('relative', 'group');
  pre.appendChild(btn);
  btn.addEventListener('click', () => {
    const code = pre.querySelector('code');
    navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('text-forge-400');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('text-forge-400');
      }, 2000);
    });
  });
});

// ── Hero animation re-trigger (for browsers that skip animation-delay on load)
document.querySelectorAll('[style*="opacity:0"]').forEach(el => {
  el.style.animationFillMode = 'forwards';
});

// ── Hero background (index page only)
const heroBg = document.getElementById('hero-bg');
const heroContent = document.getElementById('hero-content');
if (heroBg && heroContent) {
  function setHeroBackground() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const url = `https://picsum.photos/${w}/${h}?blur=10&random=1`;
    const img = new Image();
    img.onload = function() {
      heroBg.style.backgroundImage = `url('${url}')`;
      heroContent.classList.add('loaded');
    };
    img.onerror = function() {
      heroContent.classList.add('loaded');
    };
    img.src = url;
  }
  setHeroBackground();
  let heroResizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(heroResizeTimer);
    heroResizeTimer = setTimeout(setHeroBackground, 300);
  });
}

// ── Projects tag filter (projects page only)
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'border-forge-600', 'text-forge-400');
        b.classList.add('border-zinc-700', 'text-zinc-400');
      });
      btn.classList.add('active', 'border-forge-600', 'text-forge-400');
      btn.classList.remove('border-zinc-700', 'text-zinc-400');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.tags.includes(filter)) ? '' : 'none';
      });
    });
  });
}
