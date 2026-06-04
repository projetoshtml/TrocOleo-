// =============================================
//  TROCÓLEO SERVIÇOS AUTOMOTIVO — script.js
//  SPA: navegação 100% via JS, sem reload
// =============================================

const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
const navbar    = document.getElementById('navbar');
const allPages  = document.querySelectorAll('.page');

// ---- Núcleo SPA ----
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
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  navMenu.classList.remove('active');
  hamburger.classList.remove('open');
}

// ---- Lightbox Galeria ----
function abrirLightbox(el) {
  const img    = el.querySelector('img');
  const label  = el.querySelector('.galeria-label');
  const lb     = document.getElementById('lightbox');
  const lbImg  = document.getElementById('lightbox-img');
  const lbCapt = document.getElementById('lightbox-caption');
  lbImg.src            = img.src;
  lbImg.alt            = img.alt;
  lbCapt.textContent   = label ? label.textContent : '';
  lb.classList.add('ativo');
  document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
  document.getElementById('lightbox').classList.remove('ativo');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharLightbox();
});

// ---- Delegar cliques [data-section] ----
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-section]');
  if (!target) return;
  e.preventDefault();
  const section = target.dataset.section;
  if (section) showSection(section);
});

// ---- Hamburger ----
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('open');
});

// ---- Navbar sombra ao rolar ----
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 30
    ? 'rgba(5,5,5,0.99)'
    : 'rgba(10,10,10,0.97)';
});

// =============================================
//  TOAST — notificação personalizada
// =============================================
function showToast(type) {
  const existing = document.getElementById('trocoleo-toast');
  if (existing) existing.remove();

  const isSuccess = type === 'success';
  const toast = document.createElement('div');
  toast.id = 'trocoleo-toast';

  toast.innerHTML = isSuccess ? `
    <div class="toast-icon toast-icon-success">
      <i class="fas fa-check-circle"></i>
    </div>
    <div class="toast-body">
      <strong>Mensagem enviada com sucesso! 🎉</strong>
      <p>Obrigado pelo contato! Em breve nossa equipe retornará via <strong>WhatsApp</strong> ou <strong>e-mail</strong>.</p>
      <span class="toast-sub"><i class="fab fa-whatsapp"></i> (11) 9 1733 4614</span>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  ` : `
    <div class="toast-icon toast-icon-error">
      <i class="fas fa-exclamation-circle"></i>
    </div>
    <div class="toast-body">
      <strong>Erro ao enviar a mensagem ⚠️</strong>
      <p>Não foi possível enviar. Entre em contato diretamente pelo <strong>WhatsApp</strong>:</p>
      <a href="https://wa.me/5511917334614?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20diagnóstico!"
         target="_blank" class="toast-whatsapp-btn">
        <i class="fab fa-whatsapp"></i> Chamar no WhatsApp
      </a>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '100px',
    right:        '24px',
    zIndex:       '99999',
    display:      'flex',
    alignItems:   'flex-start',
    gap:          '14px',
    background:   isSuccess ? '#0d1f14' : '#1f0d0d',
    border:       `1px solid ${isSuccess ? '#2ecc71' : '#e74c3c'}`,
    borderLeft:   `5px solid ${isSuccess ? '#2ecc71' : '#e74c3c'}`,
    borderRadius: '12px',
    padding:      '20px 16px 20px 20px',
    maxWidth:     '380px',
    width:        'calc(100vw - 48px)',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.7)',
    fontFamily:   "'Segoe UI', Arial, sans-serif",
    color:        '#f0f0f0',
    animation:    'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
  });

  if (!document.getElementById('toast-keyframes')) {
    const style = document.createElement('style');
    style.id = 'toast-keyframes';
    style.textContent = `
      @keyframes toastIn {
        from { opacity:0; transform:translateX(120px); }
        to   { opacity:1; transform:translateX(0); }
      }
      @keyframes toastOut {
        from { opacity:1; transform:translateX(0); }
        to   { opacity:0; transform:translateX(120px); }
      }
      #trocoleo-toast .toast-icon { font-size:2rem; flex-shrink:0; margin-top:2px; }
      #trocoleo-toast .toast-icon-success { color:#2ecc71; }
      #trocoleo-toast .toast-icon-error   { color:#e74c3c; }
      #trocoleo-toast .toast-body { flex:1; }
      #trocoleo-toast .toast-body strong {
        display:block; font-size:1rem; margin-bottom:6px; color:#fff;
      }
      #trocoleo-toast .toast-body p {
        font-size:0.88rem; color:#bbb; line-height:1.5; margin:0 0 8px;
      }
      #trocoleo-toast .toast-sub {
        font-size:0.88rem; color:#2ecc71; font-weight:700;
      }
      #trocoleo-toast .toast-sub i { margin-right:4px; }
      #trocoleo-toast .toast-whatsapp-btn {
        display:inline-flex; align-items:center; gap:8px;
        background:#25d366; color:#000; font-weight:800;
        padding:8px 16px; border-radius:8px; text-decoration:none;
        font-size:0.9rem; margin-top:4px; transition:background 0.2s;
      }
      #trocoleo-toast .toast-whatsapp-btn:hover { background:#20b858; }
      #trocoleo-toast .toast-close {
        background:none; border:none; color:#666; cursor:pointer;
        font-size:1rem; padding:0 0 0 4px; flex-shrink:0; margin-top:2px;
        transition:color 0.2s;
      }
      #trocoleo-toast .toast-close:hover { color:#fff; }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'toastOut 0.35s ease forwards';
      setTimeout(() => toast.remove(), 350);
    }
  }, 7000);
}

// =============================================
//  FORMULÁRIO — envio AJAX
// =============================================
const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
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
        showToast('success');
      } else {
        showToast('error');
      }
    } catch {
      showToast('error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
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

document.querySelectorAll(
  '.mvv-card, .servico-card, .contato-item, .video-wrapper, .aviso-box, .galeria-item, .depoimento-card'
).forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  animObserver.observe(el);
});
// =============================================
//  LGPD — COOKIES + POLÍTICA DE PRIVACIDADE
// =============================================

const cookieBanner    = document.getElementById('cookie-banner');
const btnAceitar      = document.getElementById('cookieAceitar');
const btnRejeitar     = document.getElementById('cookieRejeitar');
const modalPriv       = document.getElementById('modal-privacidade');
const btnOpenPriv     = document.getElementById('openPrivacidade');
const btnFecharModal  = document.getElementById('fecharModal');
const btnFecharModalB = document.getElementById('fecharModalBtn');

// Verifica se já deu consentimento
function verificarCookie() {
  const consent = localStorage.getItem('trocoleo_cookie_consent');
  if (consent === 'aceito' || consent === 'rejeitado') {
    cookieBanner.classList.add('esconder');
  }
}

// Aceitar cookies
btnAceitar.addEventListener('click', () => {
  localStorage.setItem('trocoleo_cookie_consent', 'aceito');
  localStorage.setItem('trocoleo_cookie_date', new Date().toISOString());
  cookieBanner.classList.add('esconder');
  // Se quiser ativar Google Analytics apenas após aceitar, chame aqui
});

// Rejeitar cookies
btnRejeitar.addEventListener('click', () => {
  localStorage.setItem('trocoleo_cookie_consent', 'rejeitado');
  cookieBanner.classList.add('esconder');
});

// Abrir modal de privacidade
btnOpenPriv.addEventListener('click', (e) => {
  e.preventDefault();
  modalPriv.classList.add('ativo');
  document.body.style.overflow = 'hidden';
});

// Fechar modal
function fecharModalPriv() {
  modalPriv.classList.remove('ativo');
  document.body.style.overflow = '';
}
btnFecharModal.addEventListener('click', fecharModalPriv);
btnFecharModalB.addEventListener('click', fecharModalPriv);
modalPriv.addEventListener('click', (e) => {
  if (e.target === modalPriv) fecharModalPriv();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharModalPriv();
});

// Iniciar verificação
verificarCookie();