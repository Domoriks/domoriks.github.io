/* ─── OpenForge Search (Lunr.js) ─── */

const searchOverlay = document.getElementById('search-overlay');
const searchTrigger = document.getElementById('search-trigger');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let idx = null;
let searchData = [];
let focusedIndex = -1;

// ── Open / close
function openSearch() {
  searchOverlay.classList.remove('hidden');
  searchInput.focus();
  document.body.style.overflow = 'hidden';
}
function closeSearch() {
  searchOverlay.classList.add('hidden');
  searchInput.value = '';
  searchResults.innerHTML = '<p class="text-center text-zinc-500 text-sm py-8 font-mono">Start typing to search...</p>';
  focusedIndex = -1;
  document.body.style.overflow = '';
}

if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
if (searchOverlay) {
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
}
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeSearch();
  if (e.key === 'ArrowDown' && !searchOverlay.classList.contains('hidden')) moveFocus(1);
  if (e.key === 'ArrowUp' && !searchOverlay.classList.contains('hidden')) moveFocus(-1);
  if (e.key === 'Enter' && !searchOverlay.classList.contains('hidden')) selectFocused();
});

// ── Keyboard navigation
function moveFocus(dir) {
  const items = searchResults.querySelectorAll('.search-result-item');
  if (!items.length) return;
  items[focusedIndex]?.classList.remove('focused');
  focusedIndex = Math.max(0, Math.min(items.length - 1, focusedIndex + dir));
  items[focusedIndex]?.classList.add('focused');
  items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
}
function selectFocused() {
  const items = searchResults.querySelectorAll('.search-result-item');
  const focused = items[focusedIndex] || items[0];
  if (focused) {
    const url = focused.dataset.url;
    if (url) window.location.href = url;
  }
}

// ── Load search index
async function loadIndex() {
  if (idx) return;
  try {
    const res = await fetch('/search.json');
    searchData = await res.json();
    idx = lunr(function () {
      this.ref('url');
      this.field('title', { boost: 10 });
      this.field('tags', { boost: 5 });
      this.field('content');
      searchData.forEach(doc => this.add(doc));
    });
  } catch (e) {
    console.warn('Search index not available:', e);
  }
}

// ── Render results
function renderResults(query) {
  if (!query.trim()) {
    searchResults.innerHTML = '<p class="text-center text-zinc-500 text-sm py-8 font-mono">Start typing to search...</p>';
    return;
  }
  if (!idx) {
    searchResults.innerHTML = '<p class="text-center text-zinc-500 text-sm py-8 font-mono">Search index loading...</p>';
    return;
  }

  let results = [];
  try {
    results = idx.search(query + '*');
  } catch {
    try { results = idx.search(query); } catch {}
  }

  if (!results.length) {
    searchResults.innerHTML = `<p class="text-center text-zinc-500 text-sm py-8 font-mono">No results for "<span class="text-zinc-300">${escHtml(query)}</span>"</p>`;
    return;
  }

  const html = results.slice(0, 8).map(result => {
    const doc = searchData.find(d => d.url === result.ref);
    if (!doc) return '';
    const title = highlight(doc.title, query);
    const excerpt = highlight((doc.content || '').substring(0, 120), query);
    return `<a class="search-result-item" href="${doc.url}" data-url="${doc.url}">
      <span class="result-title">${title}</span>
      <span class="result-meta">${doc.type || 'page'} ${doc.tags ? '· ' + doc.tags : ''}</span>
      ${excerpt ? `<span class="result-excerpt">${excerpt}…</span>` : ''}
    </a>`;
  }).join('');

  searchResults.innerHTML = html;
  focusedIndex = -1;
}

function highlight(text, query) {
  if (!text || !query) return escHtml(text || '');
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escHtml(text).replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Input handler
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    loadIndex().then(() => renderResults(e.target.value));
  });
  searchInput.addEventListener('focus', loadIndex);
}

// ── Update navbar with keyboard shortcut hint
if (searchTrigger) {
  const isMac = (navigator.userAgentData?.platform || navigator.userAgent).toLowerCase().includes('mac');
  searchTrigger.title = isMac ? '⌘K' : 'Ctrl+K';
}
