/* Henderson Andrade — site interactions
   Plain JS, no dependencies. Mobile nav, dropdowns, scroll reveal,
   current year, and active-section highlighting for docs pages. */
(function () {
  "use strict";

  /* ---- mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- dropdowns (click on mobile, hover handled by CSS on desktop) ---- */
  var dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach(function (dd) {
    var trigger = dd.querySelector(".dropdown-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = dd.classList.contains("is-open");
      dropdowns.forEach(function (other) { other.classList.remove("is-open"); });
      dd.classList.toggle("is-open", !wasOpen);
      trigger.setAttribute("aria-expanded", String(!wasOpen));
    });
  });
  document.addEventListener("click", function () {
    dropdowns.forEach(function (dd) { dd.classList.remove("is-open"); });
  });

  /* enable hover-open on pointer-fine (desktop) devices */
  if (window.matchMedia && window.matchMedia("(hover: hover) and (min-width: 821px)").matches) {
    dropdowns.forEach(function (dd) {
      dd.addEventListener("mouseenter", function () { dd.classList.add("is-open"); });
      dd.addEventListener("mouseleave", function () { dd.classList.remove("is-open"); });
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- current year ---- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- docs: highlight active section in sidebar ---- */
  var anchorLinks = document.querySelectorAll(".docs-sidebar a[href^='#']");
  if (anchorLinks.length) {
    var map = {};
    anchorLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (target) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          anchorLinks.forEach(function (a) { a.classList.remove("is-active"); });
          if (map[entry.target.id]) map[entry.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-90px 0px -65% 0px", threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();
