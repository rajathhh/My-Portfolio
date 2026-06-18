document.addEventListener("DOMContentLoaded", () => {

// AOS
if (typeof AOS !== "undefined") {
AOS.init({
duration: 1000,
once: true,
easing: "ease-in-out"
});
}

// Navbar
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
if (navbar) {
if (window.scrollY > 50) {
navbar.classList.add("scrolled");
} else {
navbar.classList.remove("scrolled");
}
}
});

// Mobile Menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
hamburger.addEventListener("click", () => {
navLinks.classList.toggle("open");
});

```
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});
```

}

// Typing Effect
const typedRole = document.getElementById("typed-role");

if (typedRole) {

```
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
```

}

// Canvas Safety Check
const canvas = document.getElementById("bg-canvas");

if (canvas) {
const ctx = canvas.getContext("2d");

```
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 50; i++) {
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

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00d4ff";
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
```

}

});
