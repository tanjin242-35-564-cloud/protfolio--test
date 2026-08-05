/* =========================================================
   Tanjin Akter — Portfolio Scripts (Vanilla JavaScript)
   1. Loader            2. Theme toggle      3. Navbar + mobile menu
   4. Scroll spy        5. Scroll progress   6. Back to top
   7. Reveal animations 8. Counters          9. Skill bars
   10. Typing effect    11. Particles        12. Cursor + tilt
   13. Contact form     14. Misc
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. LOADING SCREEN ---------- */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    setTimeout(() => loader && loader.classList.add("hidden"), 700);
  });

  /* ---------- 2. THEME TOGGLE (persisted) ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("ta-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  $("#themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ta-theme", next);
  });

  /* ---------- 3. NAVBAR + MOBILE MENU ---------- */
  const nav = $("#nav");
  const burger = $("#burger");
  const navLinks = $("#navLinks");

  const closeMenu = () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  $$("#navLinks a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  /* ---------- 4 & 5. SCROLL SPY, PROGRESS, STICKY NAV, TO TOP ---------- */
  const sections = $$("main section[id]");
  const links = $$("#navLinks a");
  const progress = $("#progress");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;

    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 500);

    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (height > 0 ? (y / height) * 100 : 0) + "%";

    // Scroll spy — highlight the section currently in view
    let current = sections[0] ? sections[0].id : "";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 7, 8, 9. REVEAL / COUNTERS / SKILL BARS ---------- */
  const animateCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 && target >= 100 ? "+" : "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("in");

        $$(".count", el).forEach(animateCounter);
        if (el.classList.contains("count")) animateCounter(el);
        $$(".bar__track i", el).forEach((bar) => (bar.style.width = bar.dataset.w + "%"));

        io.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 90 + "ms";
    io.observe(el);
  });
  $$(".counter").forEach((el) => io.observe(el));

  /* ---------- 10. TYPING ANIMATION ---------- */
  const words = ["Software Engineer", "Web Developer", "Problem Solver", "AI Enthusiast", "Frontend Developer"];
  const typedEl = $("#typed");
  let wIndex = 0, cIndex = 0, deleting = false;

  const type = () => {
    const word = words[wIndex];
    cIndex += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, cIndex);

    let delay = deleting ? 45 : 95;
    if (!deleting && cIndex === word.length) { delay = 1500; deleting = true; }
    else if (deleting && cIndex === 0) { deleting = false; wIndex = (wIndex + 1) % words.length; delay = 320; }
    setTimeout(type, delay);
  };
  type();

  /* ---------- 11. PARTICLE BACKGROUND (pure canvas) ---------- */
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const mouse = { x: -999, y: -999 };

  const sizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor(window.innerWidth / 16));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.9 + 0.6,
    }));
  };

  const draw = () => {
    const light = root.getAttribute("data-theme") === "light";
    const dot = light ? "rgba(37,99,235,.55)" : "rgba(148,197,255,.75)";
    const line = light ? "37,99,235" : "99,160,255";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();
    });

    // connect nearby particles + react to the mouse
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          ctx.strokeStyle = "rgba(" + line + "," + (0.18 * (1 - d / 120)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      const md = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
      if (md < 160) {
        ctx.strokeStyle = "rgba(" + line + "," + (0.28 * (1 - md / 160)).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  };

  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) draw();

  /* ---------- 12. CUSTOM CURSOR + 3D TILT ---------- */
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  let rx = 0, ry = 0;

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    dot.style.transform = "translate(" + (e.clientX - 3) + "px," + (e.clientY - 3) + "px)";
  });

  const followRing = () => {
    rx += (mouse.x - rx) * 0.16;
    ry += (mouse.y - ry) * 0.16;
    ring.style.left = rx - 17 + "px";
    ring.style.top = ry - 17 + "px";
    requestAnimationFrame(followRing);
  };
  followRing();

  $$("a, button, .card, .tags span").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("grow"));
    el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
  });

  // Subtle 3D tilt on the hero photo
  $$(".tilt").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "perspective(900px) rotateY(" + px * 10 + "deg) rotateX(" + -py * 10 + "deg)";
    });
    el.addEventListener("mouseleave", () => (el.style.transform = ""));
  });

  // Parallax on floating chips
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    $$(".float-chip").forEach((c, i) => (c.style.translate = "0 " + y * (0.04 + i * 0.02) * -1 + "px"));
  }, { passive: true });

  /* ---------- 13. CONTACT FORM VALIDATION ---------- */
  const form = $("#contactForm");
  const note = $("#formNote");

  const setError = (input, msg) => {
    input.closest(".field").classList.toggle("invalid", Boolean(msg));
    const el = $('.err[data-for="' + input.id + '"]');
    if (el) el.textContent = msg || "";
    return !msg;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name"), email = $("#email"), subject = $("#subject"), message = $("#message");

    const ok = [
      setError(name, name.value.trim().length < 2 ? "Please enter your name." : ""),
      setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Please enter a valid email."),
      setError(subject, subject.value.trim().length < 3 ? "Please add a subject." : ""),
      setError(message, message.value.trim().length < 10 ? "Message must be at least 10 characters." : ""),
    ].every(Boolean);

    if (!ok) { note.textContent = "Please fix the highlighted fields."; return; }

    // No backend: open the visitor's mail client with a pre-filled message.
    const body = encodeURIComponent(message.value + "\n\n— " + name.value + " (" + email.value + ")");
    window.location.href =
      "mailto:tanjin554@gmailo.com?subject=" + encodeURIComponent(subject.value) + "&body=" + body;

    note.textContent = "Thank you! Your mail app is opening with the message.";
    form.reset();
    setTimeout(() => (note.textContent = ""), 6000);
  });

  // Clear an error as soon as the visitor types again
  $$("#contactForm input, #contactForm textarea").forEach((i) =>
    i.addEventListener("input", () => setError(i, ""))
  );

  /* ---------- 14. MISC ---------- */
  $("#year").textContent = new Date().getFullYear();
})();