// Berkeley EA site — shared behavior

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
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
