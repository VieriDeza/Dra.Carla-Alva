// ===== MEJORAS VISUALES (no afecta la lógica funcional de script.js) =====

// Sombra en el navbar al hacer scroll
const navbarEl = document.getElementById("navbar");
if (navbarEl) {
  const onScroll = () => {
    if (window.scrollY > 12) {
      navbarEl.style.boxShadow = "0 8px 30px rgba(142,68,173,0.10)";
    } else {
      navbarEl.style.boxShadow = "none";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Animación de aparición suave al hacer scroll
const revealTargets = document.querySelectorAll(
  ".section > *, .hero-features .feature, .cards-grid .card"
);

if ("IntersectionObserver" in window && revealTargets.length) {
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}
