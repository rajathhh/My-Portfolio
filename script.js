// ==========================================
// RAJATH KRISHNA PORTFOLIO JS
// ==========================================

// AOS Animation
AOS.init({
duration: 1000,
once: true,
easing: "ease-in-out"
});

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
if (window.scrollY > 50) {
navbar.classList.add("scrolled");
} else {
navbar.classList.remove("scrolled");
}
});

// Mobile Menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
navLinks.classList.toggle("open");
});

// Close Menu After Click
document.querySelectorAll(".nav-links a").forEach(link => {
link.addEventListener("click", () => {
navLinks.classList.remove("open");
});
});

// Typing Effect
const roles = [
"Network Engineer",
"FTTH Specialist",
"CCNA Certified",
"Cybersecurity Enthusiast",
"KFON Project Engineer"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const typedRole = document.getElementById("typed-role");

function typeEffect() {
const currentRole = roles[roleIndex];

if (!deleting) {
typedRole.textContent = currentRole.substring(0, charIndex++);
} else {
typedRole.textContent = currentRole.substring(0, charIndex--);
}

if (!deleting && charIndex === currentRole.length + 1) {
deleting = true;
setTimeout(typeEffect, 1500);
return;
}

if (deleting && charIndex === 0) {
deleting = false;
roleIndex = (roleIndex + 1) % roles.length;
}

setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();

// Skill Bar Animation
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const fills = entry.target.querySelectorAll(".skill-fill");

```
  fills.forEach(fill => {
    fill.style.width = fill.dataset.pct + "%";
  });
}
```

});
});

document.querySelectorAll("#skills").forEach(section => {
observer.observe(section);
});

// Contact Form
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
form.addEventListener("submit", e => {
e.preventDefault();

```
status.className = "success";
status.innerHTML =
  "✓ Thank you! Your message has been received.";

form.reset();
```

});
}

// Active Navigation Highlight
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
let current = "";

sections.forEach(section => {
const sectionTop = section.offsetTop - 120;

```
if (window.scrollY >= sectionTop) {
  current = section.getAttribute("id");
}
```

});

document.querySelectorAll(".nav-links a").forEach(link => {
link.classList.remove("active");

```
if (
  link.getAttribute("href") === "#" + current
) {
  link.classList.add("active");
}
```

});
});

// Animated Background Canvas
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
particles.push({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
radius: Math.random() * 2 + 1,
dx: (Math.random() - 0.5) * 0.5,
dy: (Math.random() - 0.5) * 0.5
});
}

function animateParticles() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

particles.forEach(p => {
p.x += p.dx;
p.y += p.dy;

```
if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

ctx.beginPath();
ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
ctx.fillStyle = "#00d4ff";
ctx.fill();

particles.forEach(other => {
  const distance = Math.hypot(
    p.x - other.x,
    p.y - other.y
  );

  if (distance < 120) {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(other.x, other.y);
    ctx.strokeStyle =
      "rgba(0,212,255,0.08)";
    ctx.stroke();
  }
});
```

});

requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener("resize", () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});
