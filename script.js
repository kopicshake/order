"use strict";


/* =========================================
   BUSINESS CONFIG
========================================= */

const BUSINESS_NAME = "Kopi C Shake";
const WHATSAPP_NUMBER = "0124669359";


/* =========================================
   PHONE NUMBER
========================================= */

function cleanMalaysiaPhone(phone) {

  const digits =
    String(phone).replace(/\D/g, "");


  if (digits.startsWith("60")) {
    return digits;
  }


  if (digits.startsWith("0")) {
    return `6${digits}`;
  }


  return digits;

}


const CLEAN_PHONE =
  cleanMalaysiaPhone(
    WHATSAPP_NUMBER
  );


/* =========================================
   WHATSAPP
========================================= */

function openWhatsApp() {

  const message =
    `Hai ${BUSINESS_NAME}! 👋\n\n` +
    `Saya mau order.\n\n` +
    `Minuman & Kuantiti:\n\n` +
    `Waktu Pickup:\n\n` +
    `Boleh saya teruskan order? Terima kasih.`;


  const url =
    `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


function initWhatsApp() {

  document
    .querySelectorAll(
      ".js-whatsapp"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        openWhatsApp
      );

    });

}


/* =========================================
   MENU SLIDER
========================================= */

function initMenuSlider() {

  const slider =
    document.getElementById(
      "menuSlider"
    );


  const prevButton =
    document.getElementById(
      "menuPrev"
    );


  const nextButton =
    document.getElementById(
      "menuNext"
    );


  if (
    !slider ||
    !prevButton ||
    !nextButton
  ) {
    return;
  }


  function getScrollAmount() {

    const firstCard =
      slider.querySelector(
        ".menu-poster"
      );


    if (!firstCard) {

      return (
        slider.clientWidth * 0.8
      );

    }


    const style =
      window.getComputedStyle(
        slider
      );


    const gap =
      parseFloat(
        style.columnGap
      ) ||
      parseFloat(
        style.gap
      ) ||
      0;


    return (
      firstCard
        .getBoundingClientRect()
        .width +
      gap
    );

  }


  function updateButtons() {

    const maxScroll =
      slider.scrollWidth -
      slider.clientWidth;


    prevButton.disabled =
      slider.scrollLeft <= 5;


    nextButton.disabled =
      slider.scrollLeft >=
      maxScroll - 5;

  }


  prevButton.addEventListener(
    "click",
    () => {

      slider.scrollBy({

        left:
          -getScrollAmount(),

        behavior:
          "smooth"

      });

    }
  );


  nextButton.addEventListener(
    "click",
    () => {

      slider.scrollBy({

        left:
          getScrollAmount(),

        behavior:
          "smooth"

      });

    }
  );


  slider.addEventListener(
    "scroll",
    () => {

      requestAnimationFrame(
        updateButtons
      );

    },
    {
      passive: true
    }
  );


  slider.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "ArrowRight"
      ) {

        event.preventDefault();


        slider.scrollBy({

          left:
            getScrollAmount(),

          behavior:
            "smooth"

        });

      }


      if (
        event.key ===
        "ArrowLeft"
      ) {

        event.preventDefault();


        slider.scrollBy({

          left:
            -getScrollAmount(),

          behavior:
            "smooth"

        });

      }

    }
  );


  window.addEventListener(
    "resize",
    updateButtons
  );


  updateButtons();

}


/* =========================================
   SMOOTH SCROLL
========================================= */

function initSmoothScroll() {

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const href =
            link.getAttribute(
              "href"
            );


          if (
            !href ||
            href === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              href
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          const top =
            target
              .getBoundingClientRect()
              .top +
            window.scrollY;


          const reducedMotion =
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;


          window.scrollTo({

            top,

            behavior:
              reducedMotion
                ? "auto"
                : "smooth"

          });

        }
      );

    });

}


/* =========================================
   SCROLL REVEAL
========================================= */

function initReveal() {

  const elements =
    document.querySelectorAll(
      ".reveal"
    );


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    reducedMotion ||
    !(
      "IntersectionObserver"
      in window
    )
  ) {

    elements.forEach(
      element => {

        element.classList.add(
          "visible"
        );

      }
    );


    return;

  }


  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry
              .target
              .classList
              .add(
                "visible"
              );


            observer.unobserve(
              entry.target
            );

          }
        );

      },

      {
        threshold: 0.08,

        rootMargin:
          "0px 0px -30px 0px"
      }

    );


  elements.forEach(
    element => {

      observer.observe(
        element
      );

    }
  );

}


/* =========================================
   IMAGE FALLBACK
========================================= */

function initImages() {

  document
    .querySelectorAll("img")
    .forEach(image => {

      image.addEventListener(
        "error",
        () => {

          const placeholder =
            document.createElement(
              "div"
            );


          placeholder.className =
            "image-placeholder";


          placeholder.textContent =
            image.alt ||
            BUSINESS_NAME;


          image.replaceWith(
            placeholder
          );

        },
        {
          once: true
        }
      );

    });

}


/* =========================================
   LIGHTBOX
========================================= */

function initLightbox() {

  const lightbox =
    document.getElementById(
      "lightbox"
    );


  const image =
    document.getElementById(
      "lightboxImage"
    );


  const title =
    document.getElementById(
      "lightboxTitle"
    );


  const closeButton =
    document.getElementById(
      "lightboxClose"
    );


  if (
    !lightbox ||
    !image ||
    !title ||
    !closeButton
  ) {
    return;
  }


  let lastFocused =
    null;


  function openLightbox(button) {

    lastFocused =
      button;


    image.src =
      button.dataset.lightbox;


    image.alt =
      button.dataset.title ||
      "Menu Kopi C Shake";


    title.textContent =
      button.dataset.title ||
      "Menu Kopi C Shake";


    lightbox.hidden =
      false;


    document.body
      .classList
      .add(
        "modal-open"
      );


    setTimeout(
      () => {

        closeButton.focus();

      },
      40
    );

  }


  function closeLightbox() {

    lightbox.hidden =
      true;


    document.body
      .classList
      .remove(
        "modal-open"
      );


    if (lastFocused) {

      lastFocused.focus();

    }

  }


  document
    .querySelectorAll(
      "[data-lightbox]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openLightbox(
            button
          );

        }
      );

    });


  closeButton
    .addEventListener(
      "click",
      closeLightbox
    );


  lightbox
    .addEventListener(
      "click",
      event => {

        if (
          event.target ===
          lightbox
        ) {

          closeLightbox();

        }

      }
    );


  document
    .addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
            "Escape" &&
          !lightbox.hidden
        ) {

          closeLightbox();

        }

      }
    );

}


/* =========================================
   CURRENT YEAR
========================================= */

function initYear() {

  const year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date()
        .getFullYear();

  }

}


/* =========================================
   INIT
========================================= */

function initWebsite() {

  initWhatsApp();

  initMenuSlider();

  initSmoothScroll();

  initReveal();

  initImages();

  initLightbox();

  initYear();

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initWebsite
  );

} else {

  initWebsite();

}
