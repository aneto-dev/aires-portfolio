const body = document.body;
const sidebar = document.querySelector("[data-sidebar]");
const menuButton = document.querySelector("[data-menu-button]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const navLinks = [...document.querySelectorAll(".section-nav a")];
const sections = [...document.querySelectorAll("[data-section]")];
const revealItems = [...document.querySelectorAll(".reveal")];

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.dataset.theme = "light";
  if (themeLabel) themeLabel.textContent = "Light";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = body.dataset.theme === "light";

    if (isLight) {
      body.removeAttribute("data-theme");
      localStorage.removeItem("theme");
      if (themeLabel) themeLabel.textContent = "Dark";
    } else {
      body.dataset.theme = "light";
      localStorage.setItem("theme", "light");
      if (themeLabel) themeLabel.textContent = "Light";
    }
  });
}

if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    body.classList.toggle("menu-open");
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    sidebar?.classList.remove("open");
    body.classList.remove("menu-open");
  });
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealItems.forEach(item => revealObserver.observe(item));
