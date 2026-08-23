"use strict";


/* =========================================
   BUSINESS CONFIG
========================================= */

const BUSINESS_NAME = "Kopi C Shake";
const WHATSAPP_NUMBER = "0124669359";


/* =========================================
   PHONE
========================================= */

function cleanMalaysiaPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.startsWith("60")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `6${digits}`;
  }

  return digits;
}

const CLEAN_PHONE = cleanMalaysiaPhone(WHATSAPP_NUMBER);


/* =========================================
   WHATSAPP
========================================= */

function openWhatsApp() {
  const message =
    `Hai ${BUSINESS_NAME}! 👋\n\n` +
    `Saya sudah lihat menu di website dan ingin buat order.\n\n` +
    `Menu / minuman:\n` +
    `\n` +
    `Kuantiti:\n` +
    `\n` +
    `Boleh maklumkan cara untuk saya teruskan order? Terima kasih.`;

  const url = `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}

function initWhatsApp() {
  document
    .querySelectorAll(".js-whatsapp")
    .forEach(button => {
      button.addEventListener("click", openWhatsApp);
    });
}


/* =========================================
   MOBILE MENU
========================================= */

function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!hamburger || !mobileMenu) {
    return;
  }

  function setMenu(open) {
    hamburger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    hamburger.setAttribute(
      "aria-label",
      open ? "Tutup menu" : "Buka menu"
    );
  }

  hamburger.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", event => {
    if (!mobileMenu.classList.contains("open")) {
      return;
    }

    if (
      event.target.closest("#hamburger") ||
      event.target.closest("#mobileMenu")
    ) {
      return;
    }

    setMenu(false);
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      mobileMenu.classList.contains("open")
    ) {
      setMenu(false);
      hamburger.focus();
    }
  });
}


/* =========================================
   HEADER
========================================= */

function initHeader() {
  const header = document.getElementById("header");

  if (!header) {
    return;
  }

  let ticking = false;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 15);
  }

  updateHeader();

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) {
        return;
      }

      ticking = true;

      requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
    },
    { passive: true }
  );
}


/* =========================================
   SMOOTH SCROLL
========================================= */

function initSmoothScroll() {
  const header = document.getElementById("header");

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        8;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });
}


/* =========================================
   REVEAL
========================================= */

function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach(element => observer.observe(element));
}


/* =========================================
   IMAGE FALLBACK
========================================= */

function initImages() {
  document.querySelectorAll("img").forEach(image => {
    image.addEventListener(
      "error",
      () => {
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        placeholder.textContent = image.alt || BUSINESS_NAME;
        image.replaceWith(placeholder);
      },
      { once: true }
    );
  });
}


/* =========================================
   LIGHTBOX
========================================= */

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImage");
  const title = document.getElementById("lightboxTitle");
  const closeButton = document.getElementById("lightboxClose");

  if (!lightbox || !image || !title || !closeButton) {
    return;
  }

  let lastFocused = null;

  function openLightbox(button) {
    lastFocused = button;

    const source = button.dataset.lightbox;
    const menuTitle = button.dataset.title || "Menu Kopi C Shake";

    image.src = source;
    image.alt = menuTitle;
    title.textContent = menuTitle;

    lightbox.hidden = false;
    document.body.classList.add("modal-open");

    setTimeout(() => closeButton.focus(), 40);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("modal-open");

    if (lastFocused) {
      lastFocused.focus();
    }
  }

  document.querySelectorAll("[data-lightbox]").forEach(button => {
    button.addEventListener("click", () => openLightbox(button));
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}


/* =========================================
   YEAR
========================================= */

function initYear() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}


/* =========================================
   INIT
========================================= */

function initWebsite() {
  initWhatsApp();
  initMobileMenu();
  initHeader();
  initSmoothScroll();
  initReveal();
  initImages();
  initLightbox();
  initYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWebsite);
} else {
  initWebsite();
}
