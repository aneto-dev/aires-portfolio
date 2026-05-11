const body = document.body;
const sidebar = document.querySelector("[data-sidebar]");
const menuButton = document.querySelector("[data-menu-button]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const clock = document.getElementById("clock");
const navLinks = [...document.querySelectorAll(".section-nav a")];
const sections = [...document.querySelectorAll("[data-section]")];
const searchInput = document.getElementById("sectionSearch");
const revealItems = [...document.querySelectorAll(".reveal")];

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 1000);

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.dataset.theme = savedTheme;
}

themeToggle.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "light" ? "dark" : "light";
  if (nextTheme === "dark") {
    body.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    body.dataset.theme = "light";
    localStorage.setItem("theme", "light");
  }
});

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  body.classList.toggle("menu-open");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
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
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach(item => revealObserver.observe(item));

function focusSectionSearch() {
  searchInput.focus();
  searchInput.select();
}

document.addEventListener("keydown", event => {
  const isMacShortcut = event.metaKey && event.key.toLowerCase() === "k";
  const isWindowsShortcut = event.ctrlKey && event.key.toLowerCase() === "k";

  if (isMacShortcut || isWindowsShortcut) {
    event.preventDefault();
    focusSectionSearch();
  }
});

searchInput.addEventListener("input", event => {
  const query = event.target.value.trim().toLowerCase();

  navLinks.forEach(link => {
    const text = link.textContent.toLowerCase();
    link.style.display = text.includes(query) ? "block" : "none";
  });
});

searchInput.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;

  const firstVisible = navLinks.find(link => link.style.display !== "none");
  if (firstVisible) {
    firstVisible.click();
    searchInput.blur();
  }
});
