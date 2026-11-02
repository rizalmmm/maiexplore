// Mai Explore Komodo — progressive enhancements (site works fully without JS)
(function () {
  "use strict";

  var WA_NUMBER = "6281246212502";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Solid header after scrolling past the hero
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("site-header--solid")) {
    var onScroll = function () {
      header.classList.toggle("is-solid", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Gallery lightbox
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (links.length) {
    var index = 0;
    var lastFocus = null;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<figure style="margin:0"><img alt=""><p></p></figure>' +
      '<button type="button" class="lightbox__close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox__prev" aria-label="Previous photo">&#8249;</button>' +
      '<button type="button" class="lightbox__next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(box);
    var img = box.querySelector("img");
    var cap = box.querySelector("p");

    var show = function (i) {
      index = (i + links.length) % links.length;
      var a = links[index];
      var thumb = a.querySelector("img");
      img.src = a.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      cap.textContent = a.getAttribute("data-caption") || img.alt;
    };
    var close = function () {
      box.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        lastFocus = a;
        show(i);
        box.hidden = false;
        document.body.style.overflow = "hidden";
        box.querySelector(".lightbox__close").focus();
      });
    });
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  // Booking form -> pre-filled WhatsApp message (no backend needed)
  var form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lines = [
        "Hi Mai Explore! I'd like to plan a dive trip.",
        "",
        "Name: " + (d.get("name") || "-"),
        "Preferred date: " + (d.get("date") || "-"),
        "Number of divers: " + (d.get("divers") || "-"),
        "Certification: " + (d.get("level") || "-"),
        "",
        String(d.get("message") || "")
      ];
      // Ad pixels (landing page only): no name or message is sent, just the trip details
      if (window.maiTrack) {
        window.maiTrack("Lead", {
          content_name: "Daily Dive Trip Komodo",
          content_category: "Diving",
          num_divers: Number(d.get("divers")) || 1,
          certification: String(d.get("level") || "")
        });
      }
      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n").trim());
      window.open(url, "_blank", "noopener");
    });
  }

  // Slider: native scroll-snap for swiping, enhanced with buttons, dots and gentle autoplay
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector(".slider__track");
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".slider__slide"));
    var controls = slider.querySelector(".slider__controls");
    var dotsWrap = slider.querySelector(".slider__dots");
    if (!track || slides.length < 2) return;

    var current = 0;
    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Photo " + (i + 1));
      b.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });
    if (controls) controls.hidden = false;

    var goTo = function (i) {
      var n = (i + slides.length) % slides.length;
      var s = slides[n];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: "smooth" });
    };
    var mark = function (i) {
      current = i;
      dots.forEach(function (d, j) { d.setAttribute("aria-selected", String(j === i)); });
    };
    mark(0);

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var center = track.scrollLeft + track.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        slides.forEach(function (s, i) {
          var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - center);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        mark(best);
        ticking = false;
      });
    }, { passive: true });

    slider.querySelector("[data-prev]").addEventListener("click", function () { goTo(current - 1); restart(); });
    slider.querySelector("[data-next]").addEventListener("click", function () { goTo(current + 1); restart(); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
    });

    // Autoplay only when visible, never with reduced motion, pauses on any interaction
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var timer = null, paused = false, visible = false;
    var stop = function () { clearInterval(timer); timer = null; };
    var start = function () {
      if (reduce || paused || !visible || timer) return;
      timer = setInterval(function () { goTo(current + 1); }, 4500);
    };
    var restart = function () { stop(); start(); };
    ["pointerdown", "focusin", "mouseenter"].forEach(function (ev) {
      slider.addEventListener(ev, function () { paused = true; stop(); });
    });
    slider.addEventListener("mouseleave", function () { paused = false; start(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) { start(); } else { stop(); }
      }, { threshold: 0.4 }).observe(slider);
    }
  });

  // Landing page: hide the sticky mobile CTA once the booking section is on screen
  var mobileCta = document.querySelector(".lp-mobile-cta");
  var bookSection = document.getElementById("book");
  if (mobileCta && bookSection && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      mobileCta.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(bookSection);
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
