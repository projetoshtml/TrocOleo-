// =============================================
// TROCÓLEO SERVIÇOS AUTOMOTIVO — script.js
// SPA + acessibilidade + contato + cookies
// =============================================

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const navbar = document.getElementById("navbar");
const paginas = document.querySelectorAll(".page");
const linksNavegacao = document.querySelectorAll("[data-section]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const itensGaleria = document.querySelectorAll(".galeria-item");

// Formulário
const form = document.getElementById("contactForm");

// Cookies / Modal
const cookieBanner = document.getElementById("cookie-banner");
const btnAceitar = document.getElementById("cookieAceitar");
const btnRejeitar = document.getElementById("cookieRejeitar");
const modalPriv = document.getElementById("modal-privacidade");
const modalBox = modalPriv?.querySelector(".modal-box");
const btnOpenPriv = document.getElementById("openPrivacidade");
const btnFecharModal = document.getElementById("fecharModal");
const btnFecharModalB = document.getElementById("fecharModalBtn");

// Toast
const toastContainer = document.getElementById("toast-container");

let ultimoElementoFocado = null;

// =============================
// Utilitários
// =============================
function elementoExiste(...elementos) {
  return elementos.every(Boolean);
}

function definirScrollTopo() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth"
  });
}

function atualizarMenuAtivo(id) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.section === id);
  });
}

function fecharMenuMobile() {
  if (!elementoExiste(navMenu, hamburger)) return;
  navMenu.classList.remove("active");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}

function abrirMenuMobile() {
  if (!elementoExiste(navMenu, hamburger)) return;
  navMenu.classList.add("active");
  hamburger.classList.add("open");
  hamburger.setAttribute("aria-expanded", "true");
}

function toggleMenuMobile() {
  if (!elementoExiste(navMenu, hamburger)) return;
  const estaAberto = navMenu.classList.contains("active");
  if (estaAberto) {
    fecharMenuMobile();
  } else {
    abrirMenuMobile();
  }
}

function atualizarHash(id) {
  if (!id) return;
  history.replaceState(null, "", `#${id}`);
}

function obterHashInicial() {
  const hash = window.location.hash.replace("#", "");
  const existe = [...paginas].some((pagina) => pagina.id === hash);
  return existe ? hash : "hero";
}

// =============================
// Navegação SPA
// =============================
function mostrarSecao(id, atualizarUrl = true) {
  paginas.forEach((pagina) => {
    const ativa = pagina.id === id;
    pagina.classList.toggle("hidden", !ativa);
    pagina.classList.toggle("active", ativa);
    pagina.setAttribute("aria-hidden", String(!ativa));
  });

  atualizarMenuAtivo(id);
  fecharMenuMobile();
  definirScrollTopo();

  if (atualizarUrl) {
    atualizarHash(id);
  }
}

function iniciarNavegacao() {
  const secaoInicial = obterHashInicial();
  mostrarSecao(secaoInicial, false);

  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-section]");
    if (!alvo) return;

    const secao = alvo.dataset.section;
    if (!secao) return;

    e.preventDefault();
    mostrarSecao(secao);
  });

  window.addEventListener("hashchange", () => {
    const secao = obterHashInicial();
    mostrarSecao(secao, false);
  });
}

// =============================
// Navbar
// =============================
function iniciarNavbar() {
  if (!navbar) return;

  const atualizarEstadoNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  };

  atualizarEstadoNavbar();
  window.addEventListener("scroll", atualizarEstadoNavbar);
}

// =============================
// Menu mobile
// =============================
function iniciarMenuMobile() {
  if (!elementoExiste(hamburger, navMenu)) return;

  hamburger.addEventListener("click", toggleMenuMobile);

  document.addEventListener("click", (e) => {
    const clicouNoMenu = e.target.closest(".nav-menu");
    const clicouNoBotao = e.target.closest("#hamburger");

    if (!clicouNoMenu && !clicouNoBotao) {
      fecharMenuMobile();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      fecharMenuMobile();
    }
  });
}

// =============================
// Fallback de imagens
// =============================
function iniciarFallbackImagens() {
  const logoPrincipal = document.getElementById("logo-principal");
  const logoFooter = document.getElementById("footer-logo");
  const heroBg = document.getElementById("hero-bg-img");

  [logoPrincipal, logoFooter].forEach((img) => {
    if (!img) return;
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  if (heroBg) {
    heroBg.addEventListener("error", () => {
      heroBg.style.display = "none";
    });
  }
}

// =============================
// Lightbox
// =============================
function abrirLightbox(item) {
  if (!elementoExiste(lightbox, lightboxImg, lightboxCaption, lightboxClose)) return;

  const img = item.querySelector("img");
  const label = item.querySelector(".galeria-label");

  if (!img) return;

  ultimoElementoFocado = document.activeElement;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || "";
  lightboxCaption.textContent = label ? label.textContent : "";
  lightbox.classList.add("ativo");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function fecharLightbox() {
  if (!elementoExiste(lightbox, lightboxImg, lightboxCaption)) return;

  lightbox.classList.remove("ativo");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  lightboxImg.alt = "";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";

  if (ultimoElementoFocado) {
    ultimoElementoFocado.focus();
  }
}

function iniciarLightbox() {
  if (!itensGaleria.length || !elementoExiste(lightbox, lightboxClose)) return;

  itensGaleria.forEach((item) => {
    item.addEventListener("click", () => abrirLightbox(item));
  });

  lightboxClose.addEventListener("click", fecharLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      fecharLightbox();
    }
  });
}

// =============================
// Toast
// =============================
function removerToast(toast) {
  if (!toast) return;
  toast.classList.add("toast-saindo");
  setTimeout(() => toast.remove(), 300);
}

function criarToastHTML(tipo) {
  if (tipo === "success") {
    return `
      <div class="toast toast-success" role="status">
        <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
        <div class="toast-body">
          <strong>Mensagem enviada com sucesso</strong>
          <p>Obrigado pelo contato. Em breve a equipe retornará por WhatsApp ou e-mail.</p>
          <span class="toast-sub"><i class="fab fa-whatsapp"></i> (11) 9 1733-4614</span>
        </div>
        <button class="toast-close" type="button" aria-label="Fechar aviso">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  }

  return `
    <div class="toast toast-error" role="alert">
      <div class="toast-icon"><i class="fas fa-exclamation-circle"></i></div>
      <div class="toast-body">
        <strong>Erro ao enviar a mensagem</strong>
        <p>Não foi possível concluir o envio. Você pode chamar diretamente no WhatsApp.</p>
        <a
          href="https://wa.me/5511917334614?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20diagnóstico!"
          target="_blank"
          rel="noopener noreferrer"
          class="toast-whatsapp-btn"
        >
          <i class="fab fa-whatsapp"></i> Chamar no WhatsApp
        </a>
      </div>
      <button class="toast-close" type="button" aria-label="Fechar aviso">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

function mostrarToast(tipo) {
  if (!toastContainer) return;

  toastContainer.innerHTML = criarToastHTML(tipo);
  const toast = toastContainer.querySelector(".toast");
  const btnFechar = toast?.querySelector(".toast-close");

  if (btnFechar && toast) {
    btnFechar.addEventListener("click", () => removerToast(toast));
  }

  if (toast) {
    setTimeout(() => removerToast(toast), 7000);
  }
}

// =============================
// Formulário
// =============================
function validarFormulario(formulario) {
  const camposObrigatorios = formulario.querySelectorAll("[required]");
  let valido = true;

  camposObrigatorios.forEach((campo) => {
    if (!campo.checkValidity()) {
      valido = false;
      campo.reportValidity();
    }
  });

  return valido;
}

function iniciarFormulario() {
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarFormulario(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const htmlOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const resposta = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (resposta.ok) {
        form.reset();
        mostrarToast("success");
      } else {
        mostrarToast("error");
      }
    } catch (erro) {
      mostrarToast("error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = htmlOriginal;
    }
  });
}

// =============================
// Reveal on scroll
// =============================
function iniciarReveal() {
  if (prefersReducedMotion) return;

  const elementos = document.querySelectorAll(".reveal");
  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elementos.forEach((el) => observer.observe(el));
}

// =============================
// Cookies
// =============================
function verificarCookie() {
  if (!cookieBanner) return;

  const consentimento = localStorage.getItem("trocoleo_cookie_consent");

  if (consentimento === "aceito" || consentimento === "rejeitado") {
    cookieBanner.classList.add("esconder");
    cookieBanner.setAttribute("aria-hidden", "true");
  } else {
    cookieBanner.classList.remove("esconder");
    cookieBanner.setAttribute("aria-hidden", "false");
  }
}

function iniciarCookies() {
  verificarCookie();

  if (btnAceitar) {
    btnAceitar.addEventListener("click", () => {
      localStorage.setItem("trocoleo_cookie_consent", "aceito");
      localStorage.setItem("trocoleo_cookie_date", new Date().toISOString());
      cookieBanner?.classList.add("esconder");
      cookieBanner?.setAttribute("aria-hidden", "true");
    });
  }

  if (btnRejeitar) {
    btnRejeitar.addEventListener("click", () => {
      localStorage.setItem("trocoleo_cookie_consent", "rejeitado");
      localStorage.setItem("trocoleo_cookie_date", new Date().toISOString());
      cookieBanner?.classList.add("esconder");
      cookieBanner?.setAttribute("aria-hidden", "true");
    });
  }
}

// =============================
// Modal de privacidade
// =============================
function obterElementosFocaveis(container) {
  if (!container) return [];
  return [
    ...container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ];
}

function manterFocoNoModal(e) {
  if (!modalPriv?.classList.contains("ativo") || e.key !== "Tab") return;

  const focaveis = obterElementosFocaveis(modalBox);
  if (!focaveis.length) return;

  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];

  if (e.shiftKey && document.activeElement === primeiro) {
    e.preventDefault();
    ultimo.focus();
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault();
    primeiro.focus();
  }
}

function abrirModalPrivacidade() {
  if (!elementoExiste(modalPriv, modalBox)) return;

  ultimoElementoFocado = document.activeElement;
  modalPriv.classList.add("ativo");
  modalPriv.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const focaveis = obterElementosFocaveis(modalBox);
  if (focaveis.length) {
    focaveis[0].focus();
  } else {
    modalBox.focus();
  }
}

function fecharModalPriv() {
  if (!modalPriv) return;

  modalPriv.classList.remove("ativo");
  modalPriv.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (ultimoElementoFocado) {
    ultimoElementoFocado.focus();
  }
}

function iniciarModalPrivacidade() {
  if (btnOpenPriv) {
    btnOpenPriv.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalPrivacidade();
    });
  }

  if (btnFecharModal) {
    btnFecharModal.addEventListener("click", fecharModalPriv);
  }

  if (btnFecharModalB) {
    btnFecharModalB.addEventListener("click", fecharModalPriv);
  }

  if (modalPriv) {
    modalPriv.addEventListener("click", (e) => {
      if (e.target === modalPriv) {
        fecharModalPriv();
      }
    });
  }
}

// =============================
// Teclado global
// =============================
function iniciarEventosTeclado() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox?.classList.contains("ativo")) {
        fecharLightbox();
        return;
      }

      if (modalPriv?.classList.contains("ativo")) {
        fecharModalPriv();
        return;
      }

      if (navMenu?.classList.contains("active")) {
        fecharMenuMobile();
      }
    }

    manterFocoNoModal(e);
  });
}

// =============================
// Inicialização
// =============================
function init() {
  iniciarNavegacao();
  iniciarNavbar();
  iniciarMenuMobile();
  iniciarFallbackImagens();
  iniciarLightbox();
  iniciarFormulario();
  iniciarReveal();
  iniciarCookies();
  iniciarModalPrivacidade();
  iniciarEventosTeclado();
}

document.addEventListener("DOMContentLoaded", init);