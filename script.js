// ================================
// Portfolio v2.0
// Fiyinfoluwa Akinyemi
// ================================
// Modules:
//   1. ScrollReveal — reveal-on-scroll
//   2. MobileNav   — nav toggle
//   3. ScrollProgress — progress bar
//   4. NavbarScroll — background/shrink
//   5. Spotlight   — mouse-following glow
//   6. Particles   — animated canvas
//   7. SmoothScroll — anchor clicks
//   8. ActiveNav   — section highlighting
//   9. StatsCounter — animated number count
//  10. ToTop       — back-to-top visibility
//  11. FooterYear  — auto year
// ================================

(function () {
  "use strict";

  /* ── helpers ── */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const on = (el, ev, fn) => el.addEventListener(ev, fn, { passive: true });
  const raf = (fn) => requestAnimationFrame(fn);
  const debounce = (fn, ms) => {
    let id;
    return (...a) => {
      clearTimeout(id);
      id = setTimeout(() => fn(...a), ms);
    };
  };

  /* ── 1. ScrollReveal ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("shown");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ── 2. MobileNav ── */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  if (navToggle && navLinks) {
    on(navToggle, "click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !open);
      navLinks.classList.toggle("open", !open);
    });

    // Close on link click
    $$("a", navLinks).forEach((link) => {
      on(link, "click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    on(document, "click", (e) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── 3. ScrollProgress ── */
  const scrollBar = $("#scrollProgress");

  if (scrollBar) {
    on(window, "scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollBar.style.transform = `scaleX(${pct / 100})`;
    });
  }

  /* ── 4. NavbarScroll ── */
  const nav = $("#nav");

  if (nav) {
    let ticking = false;
    on(window, "scroll", () => {
      if (!ticking) {
        raf(() => {
          const scrolled = window.scrollY > 40;
          nav.classList.toggle("scrolled", scrolled);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ── 5. Spotlight ── */
  const spotlight = $("#spotlight");

  if (spotlight) {
    let mouseX = -200,
      mouseY = -200;
    let curX = -200,
      curY = -200;
    let spotRaf = null;

    on(document, "mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!spotRaf) {
        spotRaf = raf(function animateSpot() {
          curX += (mouseX - curX) * 0.08;
          curY += (mouseY - curY) * 0.08;
          spotlight.style.transform = `translate(${curX - 150}px, ${curY - 150}px)`;
          if (Math.abs(curX - mouseX) > 0.5 || Math.abs(curY - mouseY) > 0.5) {
            spotRaf = raf(animateSpot);
          } else {
            spotRaf = null;
          }
        });
      }
    });

    // Hide on touch devices
    if ("ontouchstart" in window) {
      spotlight.style.display = "none";
    }
  }

  /* ── 6. Particles ── */
  const canvas = $("#particles");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    on(window, "resize", debounce(resize, 150));

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w) this.speedX *= -1;
        if (this.y < 0 || this.y > h) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 180, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const count = Math.min(80, Math.floor((w * h) / 12000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(120, 180, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      animId = raf(animate);
    }

    animate();

    // Pause when not visible
    on(document, "visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animate();
      }
    });
  }

  /* ── 7. SmoothScroll ── */
  $$('a[href^="#"]').forEach((anchor) => {
    on(anchor, "click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#" || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ── 8. ActiveNav ── */
  const navAnchors = $$(".nav-links a");

  if (navAnchors.length) {
    let activeTicking = false;
    on(window, "scroll", () => {
      if (!activeTicking) {
        raf(() => {
          let current = "";
          const scrollPos = window.scrollY + 120;

          $$(".section, .hero").forEach((section) => {
            if (
              section.offsetTop <= scrollPos &&
              section.offsetTop + section.offsetHeight > scrollPos
            ) {
              current = section.getAttribute("id");
            }
          });

          navAnchors.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
          });

          activeTicking = false;
        });
        activeTicking = true;
      }
    });
  }

  /* ── 9. StatsCounter ── */
  const statEls = $$("[data-count]");

  if (statEls.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-count"), 10);
            if (isNaN(target)) return;

            let current = 0;
            const step = Math.max(1, Math.floor(target / 60));
            const duration = 1200;
            const start = performance.now();

            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              current = Math.floor(eased * target);
              el.textContent = current;
              if (progress < 1) {
                raf(update);
              } else {
                el.textContent = target;
              }
            }

            raf(update);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    statEls.forEach((el) => countObserver.observe(el));
  }

  /* ── 10. ToTop ── */
  const toTop = $("#toTop");

  if (toTop) {
    let topTicking = false;
    on(window, "scroll", () => {
      if (!topTicking) {
        raf(() => {
          toTop.classList.toggle("visible", window.scrollY > 400);
          topTicking = false;
        });
        topTicking = true;
      }
    });

    on(toTop, "click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── 11. FooterYear ── */
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();