/* ============================================================
   EVENTRIC EVENTS — main.js
   Theme toggle · Navigation · Scroll reveals · Counters ·
   Testimonials · Portfolio filter + lightbox · Forms · FAQ
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. THEME (light + dark) ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("eventric-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("eventric-theme", next);
  }
  $$(".theme-toggle").forEach((btn) => btn.addEventListener("click", toggleTheme));

  /* ---------- 2. PRELOADER ---------- */
  window.addEventListener("load", () => {
    const pre = $(".preloader");
    if (pre) setTimeout(() => pre.classList.add("hidden"), 350);
  });
  // Fallback if load already fired / slow assets
  setTimeout(() => {
    const pre = $(".preloader");
    if (pre) pre.classList.add("hidden");
  }, 2600);

  /* ---------- 3. HEADER: scroll state + progress bar ---------- */
  const header = $(".site-header");
  const progress = $(".scroll-progress");
  const backTop = $(".back-top");

  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 40);
      if (header.classList.contains("transparent-hero")) {
        header.classList.toggle("solid", y === 0);
      }
    }
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
    if (backTop) backTop.classList.toggle("show", y > 550);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ---------- 4. MOBILE NAV ---------- */
  const burger = $(".hamburger");
  const mobileNav = $(".mobile-nav");
  const overlay = $(".nav-overlay");

  function closeNav() {
    burger && burger.classList.remove("open");
    mobileNav && mobileNav.classList.remove("open");
    overlay && overlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      burger.classList.toggle("open", open);
      overlay && overlay.classList.toggle("show", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    overlay && overlay.addEventListener("click", closeNav);
    $$("a", mobileNav).forEach((a) => a.addEventListener("click", closeNav));
  }

  /* ---------- 5. SCROLL REVEAL ---------- */
  const revealEls = $$(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- 6. COUNTERS ---------- */
  const counters = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const dur = 1700;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val.toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- 7. TESTIMONIAL SLIDER ---------- */
  const track = $(".testi-track");
  if (track) {
    const slides = $$(".testi", track);
    const dotsWrap = $(".testi-dots");
    let idx = 0;
    let timer;

    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Testimonial " + (i + 1));
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);

    function go(i, manual) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("active", di === idx));
      if (manual) restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 6000);
    }
    go(0);
    restart();
  }

  /* ---------- 8. PORTFOLIO FILTER ---------- */
  const filterBtns = $$(".filter-btn");
  if (filterBtns.length) {
    const items = $$(".p-item");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        items.forEach((it, i) => {
          const match = cat === "all" || it.dataset.category === cat;
          if (match) {
            it.classList.remove("hide");
            it.style.animation = "none";
            // reflow to restart animation
            void it.offsetWidth;
            it.style.animation = `fadeUp .6s var(--ease) ${i * 0.06}s forwards`;
            it.style.opacity = "0";
          } else {
            it.classList.add("hide");
          }
        });
      });
    });
  }

  /* ---------- 9. LIGHTBOX ---------- */
  const lightbox = $(".lightbox");
  if (lightbox) {
    const lbImg = $("img", lightbox);
    const lbCap = $(".lb-caption", lightbox);
    const gallery = $$(".p-item");
    let current = 0;

    const open = (i) => {
      current = i;
      const item = gallery[i];
      const img = $("img", item);
      lbImg.src = img.src.replace(/w=\d+/, "w=1600");
      lbImg.alt = img.alt;
      const title = $("h3", item);
      lbCap.textContent = title ? title.textContent : img.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    };
    const nav = (dir) => {
      let next = current + dir;
      // skip hidden (filtered-out) items
      while (next >= 0 && next < gallery.length && gallery[next].classList.contains("hide")) {
        next += dir;
      }
      if (next < 0 || next >= gallery.length) return;
      open(next);
    };

    gallery.forEach((it, i) => it.addEventListener("click", () => open(i)));
    $(".lb-close", lightbox).addEventListener("click", close);
    $(".lb-prev", lightbox).addEventListener("click", (e) => { e.stopPropagation(); nav(-1); });
    $(".lb-next", lightbox).addEventListener("click", (e) => { e.stopPropagation(); nav(1); });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
    });
  }

  /* ---------- 10. FAQ ACCORDION ---------- */
  $$(".faq-item").forEach((item) => {
    const q = $(".faq-q", item);
    const a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item").forEach((other) => {
        other.classList.remove("open");
        $(".faq-a", other).style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- 11. CONTACT FORM VALIDATION ---------- */
  const form = $(".contact-form form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      $$("[required]", form).forEach((field) => {
        const empty = !field.value.trim();
        const badEmail =
          field.type === "email" &&
          field.value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        field.classList.toggle("error", empty || badEmail);
        if (empty || badEmail) valid = false;
      });
      if (!valid) {
        form.querySelector(".error")?.focus();
        return;
      }
      // success state (front-end demo — no backend)
      form.style.display = "none";
      const ok = $(".form-success");
      if (ok) ok.classList.add("show");
    });
    $$(".form-control", form).forEach((f) =>
      f.addEventListener("input", () => f.classList.remove("error"))
    );
  }

  /* ---------- 12. NEWSLETTER (footer) ---------- */
  const nl = $(".newsletter");
  if (nl) {
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", nl);
      if (input.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        const btn = $("button", nl);
        btn.textContent = "✓";
        input.value = "";
        input.placeholder = "Subscribed — thank you!";
        setTimeout(() => {
          btn.textContent = "Join";
          input.placeholder = "Your email address";
        }, 3200);
      } else {
        input.focus();
        input.style.boxShadow = "0 0 0 2px #d3455b";
        setTimeout(() => (input.style.boxShadow = ""), 1400);
      }
    });
  }

  /* ---------- 13. YEAR IN FOOTER ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- 14. GENTLE PARALLAX (hero background) ---------- */
  const heroBg = $(".hero-bg, .page-hero-bg");
  if (heroBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroBg.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
        }
      },
      { passive: true }
    );
  }
})();
