/* ============================================================
   RAJATH KRISHNA — PORTFOLIO INTERACTIONS
   ============================================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initBoot();
    initScrollProgress();
    initBackToTop();
    initTimelineDraw();
    initSkillFilter();
    initModals();
    initThemeToggle();
    initNavbar();
    initMobileMenu();
    initTyping();
    initCanvas();
    initReveal();
    initCounters();
    initMagneticSkillCards();
    initCertDetails();
    initForm();
    initYear();
  });

  /* ── Theme toggle ── */
  function initThemeToggle() {
    var root = document.documentElement;
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    function currentTheme() {
      return root.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    function apply(theme, persist) {
      root.setAttribute("data-theme", theme);
      if (persist) {
        try {
          localStorage.setItem("theme", theme);
        } catch (e) { /* storage unavailable — ignore */ }
      }
      var isLight = theme === "light";
      toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      toggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (document.startViewTransition && !reduced) {
        // Animated cross-fade via the View Transitions API (Chrome/Edge/Safari 18+)
        document.startViewTransition(function () {
          apply(next, true); // only persist on explicit user choice
        });
      } else {
        // Fallback: instant switch + existing CSS color transitions
        apply(next, true);
      }
    });

    // Sync aria state on load WITHOUT writing to storage,
    // so the system-preference fallback keeps working until the user chooses.
    apply(currentTheme(), false);
  }

  /* ── Navbar: scroll state + active section ── */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 30) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active link highlighting
    var sections = document.querySelectorAll("section[id]");
    var links = document.querySelectorAll(".nav-link");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          links.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    var hamburger = document.getElementById("hamburger");
    var navLinks = document.getElementById("nav-links");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── Typing effect ── */
  function initTyping() {
    var el = document.getElementById("typed-role");
    if (!el) return;

    var roles = [
      "Network Engineer",
      "Cybersecurity Professional",
      "CCNA Certified",
      "CLLMSP Certified",
      "FTTH/GPON Specialist",
      "KFON Project Engineer"
    ];

    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = roles[roleIndex];
      if (!deleting) {
        el.textContent = current.substring(0, charIndex++);
      } else {
        el.textContent = current.substring(0, charIndex--);
      }

      if (!deleting && charIndex === current.length + 1) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(tick, deleting ? 40 : 90);
    }
    tick();
  }

  /* ── Network particle canvas ── */
  function initCanvas() {
    var canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var W, H;
    var particles = [];
    var mouse = { x: null, y: null };
    var ACCENT = "56, 245, 184";
    var ACCENT2 = "77, 159, 255";
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var count = Math.min(70, Math.floor((W * H) / 26000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.6,
          color: Math.random() > 0.5 ? ACCENT : ACCENT2
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Mouse attraction
        if (mouse.x !== null) {
          var dx = mouse.x - p.x;
          var dy = mouse.y - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            p.x += (dx / dist) * 0.35;
            p.y += (dy / dist) * 0.35;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.color + ", 0.55)";
        ctx.fill();
      }

      // Connector lines
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var pa = particles[a];
          var pb = particles[b];
          var d = Math.sqrt(Math.pow(pa.x - pb.x, 2) + Math.pow(pa.y - pb.y, 2));
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = "rgba(77, 159, 255, " + (0.12 * (1 - d / 130)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (!reduced) requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", function () {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    step();
  }

  /* ── Scroll reveal ── */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    // Stagger children within grids
    els.forEach(function (el, i) {
      if (!el.style.getPropertyValue("--reveal-delay")) {
        var parent = el.parentElement;
        if (parent && (parent.classList.contains("skills-grid") ||
            parent.classList.contains("projects-grid") ||
            parent.classList.contains("certs-grid"))) {
          el.style.setProperty("--reveal-delay", ((i % 3) * 0.09) + "s");
        }
      }
    });

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Animated counters ── */
  function initCounters() {
    var stats = document.querySelectorAll("[data-count]");
    if (!stats.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var duration = 1400;
      var start = null;

      function frame(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = (target * eased).toFixed(decimals);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = target.toFixed(decimals);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      stats.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach(function (el) { observer.observe(el); });
  }

  /* ── Cursor-tracked glow on skill cards ── */
  function initMagneticSkillCards() {
    var cards = document.querySelectorAll(".skill-card, .cert-card, .project-card");
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }

  /* ── Certification years & links (populated once exact data is provided) ── */
  function initCertDetails() {
    var LINKEDIN = "https://linkedin.com/in/rajath-krishna-3042a627a";
    var details = {
      // Issue dates are already in the HTML (from resume.docx).
      // Paste individual credential URLs below to replace the LinkedIn fallback:
      // "cllmsp":      { year: "Jul 2026", url: "https://...credential..." },
      // "cyberops":    { year: "Jul 2026", url: "https://..." },
      // "ccna":        { year: "Jan 2025", url: "https://..." },
      // "devnet":      { year: "Apr 2025", url: "https://..." },
      // "eh-badge":    { year: "Apr 2024", url: "https://..." },
      // "csa":         { year: "In Progress", url: "https://..." },
      // "ccnp":        { year: "In Progress", url: "https://..." }
    };

    document.querySelectorAll(".cert-year[data-cert]").forEach(function (el) {
      var key = el.getAttribute("data-cert");
      var entry = details[key];
      if (entry && entry.year) el.textContent = entry.year;

      var card = el.closest(".cert-card");
      if (card) {
        var link = card.querySelector(".verify-link");
        if (link && entry && entry.url) {
          link.href = entry.url;
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener");
        } else if (link) {
          link.href = LINKEDIN;
        }
      }
    });
  }

  /* ── Contact form ──
     Powered by Formspree (free, 50 submissions/month).
     To activate: sign up at https://formspree.io, create a form, and paste
     its endpoint below — e.g. "https://formspree.io/f/abcdwxyz".
     Until then the form gracefully falls back to opening the visitor's mail client. */
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    // ── CONFIG: paste your Formspree endpoint here ──
    var FORM_ENDPOINT = "https://formspree.io/f/maewwdbr";

    var btn = document.getElementById("form-btn");
    var status = document.getElementById("form-status");

    function setStatus(msg, isError) {
      if (!status) return;
      status.textContent = msg;
      status.classList.toggle("error", !!isError);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim() || "Portfolio enquiry";
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        setStatus("! Please complete all required fields.", true);
        return;
      }

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        setStatus("! Please enter a valid email address.", true);
        return;
      }

      var live = FORM_ENDPOINT.indexOf("YOUR_FORM_ID") === -1;

      if (!live) {
        // Fallback: pre-fill the visitor's mail client.
        var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
        window.location.href = "mailto:rajathkrishna83@gmail.com?subject=" +
          encodeURIComponent(subject) + "&body=" + body;
        setStatus("\u2713 Message ready — hit send in your mail app. Thank you!");
        setTimeout(function () { form.reset(); setStatus(""); }, 4500);
        return;
      }

      var original = btn ? btn.innerHTML : "";
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting…';
      }
      setStatus("Establishing encrypted channel…", false);

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
      })
        .then(function (res) { return res.ok ? res.json() : Promise.reject(res); })
        .then(function () {
          setStatus("\u2713 Message transmitted securely. I'll get back to you soon!");
          form.reset();
        })
        .catch(function () {
          setStatus("! Transmission failed — please email me directly at rajathkrishna83@gmail.com", true);
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = original;
          }
        });
    });
  }

  /* ── Terminal boot screen ── */
  function initBoot() {
    var boot = document.getElementById("boot-screen");
    if (!boot) return;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      boot.remove();
      return;
    }

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      boot.classList.add("done");
      document.body.style.overflow = "";
      setTimeout(function () { boot.remove(); }, 600);
    }

    document.body.style.overflow = "hidden";
    setTimeout(finish, 1750);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") finish();
    });
  }

  /* ── Scroll progress bar ── */
  function initScrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ── Back to top ── */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;

    function onScroll() {
      btn.classList.toggle("visible", window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── Timeline draw-on-scroll ── */
  function initTimelineDraw() {
    var tl = document.querySelector(".timeline");
    if (!tl) return;

    if (!("IntersectionObserver" in window)) {
      tl.classList.add("draw");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tl.classList.add("draw");
            observer.unobserve(tl);
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(tl);
  }

  /* ── Skill filter tabs ── */
  function initSkillFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".skill-card[data-category]");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        var filter = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          if (match) {
            card.classList.remove("filter-hide");
            card.classList.add("visible", "filter-in");
            setTimeout(function () { card.classList.remove("filter-in"); }, 500);
          } else {
            card.classList.add("filter-hide");
            card.classList.remove("filter-in");
          }
        });
      });
    });
  }

  /* ── Project detail modals ── */
  function initModals() {
    var overlay = document.getElementById("project-modal");
    var closeBtn = document.getElementById("modal-close");
    var bodyEl = document.getElementById("modal-body");
    if (!overlay || !closeBtn || !bodyEl) return;

    var projects = {
      "isp-deployment": {
        icon: "fa-diagram-project",
        tag: "Network Design",
        title: "Small ISP Network Deployment",
        desc: "A complete ISP-scale network designed and simulated in Cisco Packet Tracer — from the edge firewall down to client subnets. The project models a real service-provider topology with redundant paths and a hardened perimeter.",
        highlights: [
          "Designed multi-site topology: routers, managed switches, a wireless tower and client LANs",
          "Configured OSPF dynamic routing with failover across the core",
          "Deployed DNS & HTTP servers with VLAN separation for services and clients",
          "Hardened the edge with ACL policies, port security and SSH-only management"
        ],
        stack: ["Packet Tracer", "Router", "Switch", "Firewall", "DNS", "OSPF", "ACL", "Port Security", "VLAN"]
      },
      "gesture-vocalizer": {
        icon: "fa-hand-point-up",
        tag: "Hardware + Software",
        title: "Gesture Vocalizer",
        desc: "An assistive embedded device that converts hand gestures into real-time speech, built for speech-impaired individuals. Flex-sensor data is mapped to phrases and played back through a dedicated voice module.",
        highlights: [
          "Built gesture-to-speech pipeline: flex sensors → ESP32 → audio output",
          "Integrated APR33A3 voice module for pre-recorded speech synthesis",
          "Tuned sensor thresholds for reliable, low-latency gesture detection",
          "Designed a portable, low-power form factor for daily use"
        ],
        stack: ["ESP32", "APR33A3", "Flex Sensors", "Embedded C", "IoT", "Arduino IDE"]
      },
      "llm-soc-lab": {
        icon: "fa-shield-halved",
        tag: "Security Lab",
        title: "LLM Security & SOC Lab",
        desc: "A hands-on security lab combining offensive AI security with SOC operations. I practice OWASP LLM Top 10 attack patterns while running through detection and response workflows used in real security operations centers.",
        highlights: [
          "Simulated prompt-injection and jailbreak attacks against LLM endpoints",
          "Mapped attacks to the OWASP LLM Top 10 and documented mitigations",
          "Practiced SIEM log analysis, correlation and alert triage",
          "Built incident-response playbooks for credential-theft and abuse scenarios"
        ],
        stack: ["LLM Security", "OWASP Top 10", "SIEM", "Threat Intel", "Incident Response", "Python"]
      }
    };

    var lastFocused = null;

    function build(p) {
      return (
        '<div class="modal-head">' +
          '<div class="modal-icon"><i class="fas ' + p.icon + '"></i></div>' +
          '<span class="modal-tag">' + p.tag + '</span>' +
        '</div>' +
        '<h3 id="modal-title">' + p.title + '</h3>' +
        '<p class="modal-desc">' + p.desc + '</p>' +
        '<ul class="modal-highlights">' +
          p.highlights.map(function (h) {
            return '<li><i class="fas fa-angle-right"></i>' + h + '</li>';
          }).join("") +
        '</ul>' +
        '<div class="modal-stack">' +
          p.stack.map(function (s) {
            return '<span class="stack-tag">' + s + '</span>';
          }).join("") +
        '</div>'
      );
    }

    function open(id) {
      var p = projects[id];
      if (!p) return;
      bodyEl.innerHTML = build(p);
      overlay.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { overlay.classList.add("open"); });
      });
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(function () { overlay.hidden = true; }, 400);
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll(".project-details").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lastFocused = btn;
        open(btn.getAttribute("data-project"));
      });
    });

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    // Focus trap: keep Tab cycling within the modal while open
    overlay.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || overlay.hidden) return;
      var focusables = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) close();
    });
  }

  /* ── Footer year ── */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
