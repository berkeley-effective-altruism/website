// EA Berkeley site — shared behavior

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the mobile menu after a nav link is tapped
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header: hide on scroll down, reveal on scroll up
  var header = document.querySelector(".site-header");
  if (header) {
    var lastScrollY = window.scrollY;
    var ticking = false;
    var updateHeaderVisibility = function () {
      var currentScrollY = window.scrollY;
      var delta = currentScrollY - lastScrollY;
      if (currentScrollY <= header.offsetHeight) {
        header.classList.remove("is-hidden");
      } else if (delta > 5) {
        header.classList.add("is-hidden");
      } else if (delta < -5) {
        header.classList.remove("is-hidden");
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateHeaderVisibility);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // Back-to-top button
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    var updateBackToTop = function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    };
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  // Photo lightbox (events page)
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var lightboxClose = lightbox.querySelector(".lightbox-close");
    var lastFocused = null;

    var openLightbox = function (src, alt) {
      lastFocused = document.activeElement;
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.add("is-open");
      lightboxClose.focus();
      document.body.style.overflow = "hidden";
    };

    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      lightboxImg.src = "";
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll(".photo-grid button.photo").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        openLightbox(img.src, img.alt);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 0.08 + "s";
        observer.observe(el);
      });
    }
  }

  // Hero parallax: background drifts slowly, blobs exit faster than scroll
  var hero = document.querySelector(".hero");
  var heroBg = document.querySelector(".hero-bg");
  var heroBlobs = document.querySelector(".hero-blobs");

  if (hero && heroBg && heroBlobs && !prefersReducedMotion) {
    var ticking = false;

    var updateParallax = function () {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      var scrolled = Math.max(-rect.top, 0);
      heroBg.style.transform = "translateY(" + scrolled * 0.25 + "px)";
      heroBlobs.style.transform = "translateY(" + scrolled * -1.4 + "px)";
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );

    updateParallax();
  }
});
