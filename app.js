// Portfolio interactions: cursor spotlight + sidebar scroll-spy. Vanilla, no deps.

// ---- 1. Cursor spotlight ---------------------------------------------------
(function spotlight() {
  const el = document.getElementById("spotlight");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  if (reduce || noHover) return;

  let x = 0, y = 0, queued = false;
  function apply() {
    queued = false;
    el.style.setProperty("--x", x + "px");
    el.style.setProperty("--y", y + "px");
  }
  window.addEventListener("mousemove", (e) => {
    x = e.clientX; y = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(apply); }
  }, { passive: true });
})();

// ---- 2. Scroll-spy ---------------------------------------------------------
(function scrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  if (!links.length) return;

  const byId = new Map();
  const sections = [];
  links.forEach((link) => {
    const id = (link.getAttribute("href") || "").replace("#", "");
    const section = id && document.getElementById(id);
    if (section) { byId.set(section, link); sections.push(section); }
  });
  if (!sections.length) return;

  function setActive(link) {
    links.forEach((l) => l.classList.toggle("active", l === link));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(byId.get(entry.target));
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach((s) => observer.observe(s));
  setActive(byId.get(sections[0])); // initial state
})();
