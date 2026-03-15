// ── CONFIG ──
const API_BASE = 'http://localhost:3000';

// ── HAMBURGER ──
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// ── CNC COORD ANIMATION ──
function animateCoords() {
  const xEl = document.getElementById('xval');
  const yEl = document.getElementById('yval');
  const zEl = document.getElementById('zval');
  if (!xEl) return;

  let t = 0;
  setInterval(() => {
    t += 0.05;
    const x = (Math.sin(t) * 50).toFixed(3).padStart(7, ' ');
    const y = (Math.cos(t * 1.3) * 35).toFixed(3).padStart(7, ' ');
    const z = (-Math.abs(Math.sin(t * 0.5)) * 20).toFixed(3).padStart(7, ' ');
    xEl.textContent = x;
    yEl.textContent = y;
    zEl.textContent = z;
  }, 80);
}

animateCoords();

// ── REGISTER ──
async function registerParticipant() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const event = document.getElementById('reg-event').value.trim();
  const status = document.getElementById('form-status');

  if (!name || !email || !event) {
    setStatus(status, '⚠ All fields are required.', 'err');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus(status, '⚠ Please enter a valid email.', 'err');
    return;
  }

  setStatus(status, '⟳ Submitting...', '');

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, eventName: event })
    });

    const data = await res.json();

    if (res.ok) {
      setStatus(status, `✓ Registered successfully! Welcome, ${name}.`, 'ok');
      document.getElementById('reg-name').value  = '';
      document.getElementById('reg-email').value = '';
      document.getElementById('reg-event').value = '';
      loadRegistrations();
    } else {
      setStatus(status, `⚠ ${data.message || 'Registration failed.'}`, 'err');
    }
  } catch (err) {
    setStatus(status, '⚠ Cannot reach server. Is the backend running?', 'err');
  }
}

function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'form-status';
  if (type === 'ok')  el.classList.add('status-ok');
  if (type === 'err') el.classList.add('status-err');
}

// ── LOAD REGISTRATIONS ──
async function loadRegistrations() {
  const tbody = document.getElementById('reg-tbody');
  const countEl = document.querySelector('.table-count');

  tbody.innerHTML = '<tr><td colspan="5" class="empty-state">⟳ Loading records...</td></tr>';

  try {
    const res  = await fetch(`${API_BASE}/registrations`);
    const data = await res.json();
    const list = data.registrations || data;

    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No registrations yet.</td></tr>';
      countEl.textContent = '0 RECORDS';
      return;
    }

    countEl.textContent = `${list.length} RECORD${list.length !== 1 ? 'S' : ''}`;

    tbody.innerHTML = list.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escHtml(r.name)}</td>
        <td>${escHtml(r.email)}</td>
        <td>${escHtml(r.eventName)}</td>
        <td>${formatDate(r.createdAt)}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">⚠ Cannot reach server. Start the backend.</td></tr>';
    countEl.textContent = '— RECORDS';
  }
}

function escHtml(s = '') {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// Auto-load on page ready
window.addEventListener('DOMContentLoaded', loadRegistrations);

// Smooth active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) cur = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${cur}` ? 'var(--accent)' : '';
  });
});
