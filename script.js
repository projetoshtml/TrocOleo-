// =============================================
//  TROCÓLEO SERVIÇOS AUTOMOTIVO — script.js
//  SPA: navegação 100% via JS, sem reload
// =============================================

// ---- Referências ----
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
const navbar    = document.getElementById('navbar');
const allPages  = document.querySelectorAll('.page');
const allLinks  = document.querySelectorAll('[data-section]');

// ---- Núcleo SPA: troca de seção ----
function showSection(id) {
  allPages.forEach(page => {
    if (page.id === id) {
      page.classList.remove('hidden');
      page.classList.add('active');
    } else {
      page.classList.add('hidden');
      page.classList.remove('active');
    }
  });

  // Atualiza link ativo na nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });

  // Sobe para o topo sem recarregar
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Fecha menu mobile se aberto
  navMenu.classList.remove('active');
  hamburger.classList.remove('open');
}

// ---- Delegar cliques em qualquer [data-section] ----
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-section]');
  if (!target) return;
  e.preventDefault();
  const section = target.dataset.section;
  if (section) showSection(section);
});

// ---- Hamburger menu mobile ----
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('open');
});

// ---- Navbar — sombra ao rolar ----
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 30
    ? 'rgba(5,5,5,0.99)'
    : 'rgba(10,10,10,0.97)';
});

// ---- Formulário Formspree — AJAX + mensagem de sucesso ----
const form       = document.getElementById('contactForm');
const successMsg = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        form.style.display = 'none';
        successMsg.style.display = 'block';
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        alert('Ocorreu um erro. Tente pelo WhatsApp: (11) 9 1733 4614');
      }
    } catch {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
      alert('Erro de conexão. Tente pelo WhatsApp: (11) 9 1733 4614');
    }
  });
}

// ---- Animação de entrada nos cards ----
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.mvv-card, .servico-card, .contato-item, .video-wrapper, .aviso-box')
  .forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    animObserver.observe(el);
  });