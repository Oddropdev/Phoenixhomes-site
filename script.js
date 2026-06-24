const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
if (!prefersReducedMotion && !isCoarsePointer && window.innerWidth > 720) {
  let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2, currentX = targetX, currentY = targetY, ticking = false;
  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX; targetY = event.clientY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const px = (targetX / window.innerWidth - 0.5) * 26;
        const py = (targetY / window.innerHeight - 0.5) * 18;
        root.style.setProperty("--parallax-x", `${px}px`);
        root.style.setProperty("--parallax-y", `${py}px`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  function animateCursorGlow() {
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;
    root.style.setProperty("--mx", `${currentX}px`);
    root.style.setProperty("--my", `${currentY}px`);
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();
}
const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 42, 240)}ms`;
  revealObserver.observe(item);
});
const interactivePanels = document.querySelectorAll(".brand-card, .use-card, .identity-preview, .acquisition-panel");
if (!isCoarsePointer) {
  interactivePanels.forEach((panel) => {
    panel.addEventListener("pointermove", (event) => {
      const rect = panel.getBoundingClientRect();
      const localX = ((event.clientX - rect.left) / rect.width) * 100;
      const localY = ((event.clientY - rect.top) / rect.height) * 100;
      panel.style.setProperty("--mx-local", `${localX}%`);
      panel.style.setProperty("--my-local", `${localY}%`);
    }, { passive: true });
  });
}
const magneticButtons = document.querySelectorAll(".magnetic");
if (!prefersReducedMotion && !isCoarsePointer) {
  magneticButtons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${clamp(x * 0.055, -8, 8)}px, ${clamp(y * 0.08, -8, 8)}px)`;
    });
    button.addEventListener("pointerleave", () => { button.style.transform = "translate(0, 0)"; });
  });
}
const header = document.querySelector(".site-header");
let headerTicking = false;
window.addEventListener("scroll", () => {
  if (headerTicking) return;
  window.requestAnimationFrame(() => {
    const y = window.scrollY;
    const opacity = clamp(y / 260, 0, 1);
    header.style.background = `linear-gradient(180deg, rgba(8, 6, 4, ${0.72 + opacity * 0.18}), rgba(8, 6, 4, ${opacity * 0.38}))`;
    header.style.borderBottom = opacity > 0.22 ? "1px solid rgba(255,247,236,0.08)" : "1px solid transparent";
    headerTicking = false;
  });
  headerTicking = true;
}, { passive: true });
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
