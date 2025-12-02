// main.js — small helpers (logout)
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-logout]')) {
    fetch('/logout', { method: 'GET' }).then(()=> location.href = '/');
  }
});
