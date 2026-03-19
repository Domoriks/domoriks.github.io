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

// ── Mobile menu toggle (sidebar on doc pages, dropdown otherwise)
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileSidebar = document.getElementById('mobile-sidebar');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileClose = document.getElementById('mobile-sidebar-close');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileBtn) {
  if (mobileSidebar && mobileOverlay) {
    // Doc pages: slide-out sidebar
    var openSidebar = function() {
      mobileOverlay.classList.remove('hidden');
      requestAnimationFrame(function() {
        mobileSidebar.style.transform = 'translateX(0)';
        mobileOverlay.style.opacity = '1';
      });
      document.body.style.overflow = 'hidden';
    };
    var closeSidebar = function() {
      mobileSidebar.style.transform = 'translateX(-100%)';
      mobileOverlay.style.opacity = '0';
      document.body.style.overflow = '';
      setTimeout(function() { mobileOverlay.classList.add('hidden'); }, 300);
    };
    mobileBtn.addEventListener('click', openSidebar);
    if (mobileClose) mobileClose.addEventListener('click', closeSidebar);
    mobileOverlay.addEventListener('click', closeSidebar);
  } else if (mobileMenu) {
    // Non-doc pages: simple dropdown
    mobileBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', function(e) {
      if (!mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
}

// ── Dark / Light theme toggle
const themeToggle = document.getElementById('theme-toggle');
const iconMoon = document.getElementById('icon-moon');
const iconSun = document.getElementById('icon-sun');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

function applyTheme(theme) {
  if (theme === 'light') {
    html.classList.add('light');
    html.setAttribute('data-theme', 'light');
    document.body.classList.replace('bg-zinc-950', 'bg-zinc-50');
    document.body.classList.replace('text-zinc-100', 'text-zinc-900');
    if (iconMoon) iconMoon.classList.add('hidden');
    if (iconSun) iconSun.classList.remove('hidden');
  } else {
    html.classList.remove('light');
    html.setAttribute('data-theme', 'dark');
    document.body.classList.replace('bg-zinc-50', 'bg-zinc-950');
    document.body.classList.replace('text-zinc-900', 'text-zinc-100');
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
    headings.forEach(h => {
      if (!h.id) {
        h.id = h.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
