const body = document.body;
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
const revealItems = [...document.querySelectorAll(".reveal")];
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
    body.classList.toggle("menu-open");
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    body.classList.remove("menu-open");
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

const rotatingText = document.querySelector("[data-rotating-text]");
const rotatingItems = [
  "order systems",
  "distributed workflows",
  "production problems",
  "software people rely on"
];

if (rotatingText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let rotatingIndex = 0;
  window.setInterval(() => {
    rotatingIndex = (rotatingIndex + 1) % rotatingItems.length;
    rotatingText.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-5px)" },
        { opacity: 0, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 420, easing: "ease" }
    );
    window.setTimeout(() => {
      rotatingText.textContent = rotatingItems[rotatingIndex];
    }, 200);
  }, 2600);
}

const systemContent = {
  ordering: {
    label: "Ordering",
    title: "Owns the order lifecycle",
    copy: "Coordinates the placement workflow and keeps the customer-facing order state separate from work happening across other parts of the platform.",
    tags: ["Process manager", "Outbox", "Order state"]
  },
  inventory: {
    label: "Inventory",
    title: "Reserve before taking payment",
    copy: "Inventory reservations are explicit and time-bounded. A failed or expired placement can release stock without pretending the whole platform shares one transaction.",
    tags: ["Reservations", "Expiry", "Compensation"]
  },
  payments: {
    label: "Payments",
    title: "Treat uncertainty as a real state",
    copy: "A timeout does not automatically mean a payment failed. Indeterminate outcomes are reconciled before the workflow decides whether to continue or compensate.",
    tags: ["Idempotency", "Reconciliation", "Authorisation"]
  },
  fulfilment: {
    label: "Fulfilment",
    title: "The physical world gets the final say",
    copy: "Cancellation and fulfilment can race. Fulfilment is authoritative once dispatch work has crossed the point where the physical operation can no longer be safely undone.",
    tags: ["Race handling", "Dispatch", "Authority"]
  },
  returns: {
    label: "Returns",
    title: "Refunds must survive retries too",
    copy: "Returns and refunds use stable identifiers so retries and duplicate delivery do not create duplicate financial side effects.",
    tags: ["Stable RefundId", "At-least-once", "Audit trail"]
  }
};

const systemNodes = [...document.querySelectorAll("[data-system-key]")];
const systemLabel = document.querySelector("[data-system-label]");
const systemTitle = document.querySelector("[data-system-title]");
const systemCopy = document.querySelector("[data-system-copy]");
const systemTags = document.querySelector("[data-system-tags]");

systemNodes.forEach(node => {
  node.addEventListener("click", () => {
    const key = node.dataset.systemKey;
    const content = systemContent[key];
    if (!content) return;

    systemNodes.forEach(item => item.classList.toggle("active", item === node));
    if (systemLabel) systemLabel.textContent = content.label;
    if (systemTitle) systemTitle.textContent = content.title;
    if (systemCopy) systemCopy.textContent = content.copy;
    if (systemTags) {
      systemTags.innerHTML = content.tags.map(tag => `<span>${tag}</span>`).join("");
    }
  });
});

const methodContent = {
  problem: {
    kicker: "01 / Problem first",
    title: "Understand what the system actually needs to do",
    copy: "Before choosing patterns or technology, I want the business rule, the awkward cases and who gets hurt when it goes wrong."
  },
  boundaries: {
    kicker: "02 / Boundaries",
    title: "Put complexity where it belongs",
    copy: "Clear ownership makes change safer. I look for boundaries that match real responsibilities rather than splitting code just to create more services."
  },
  failure: {
    kicker: "03 / Failure",
    title: "Assume retries, duplicates and partial failure will happen",
    copy: "The happy path is only part of the design. Recovery, idempotency and operational control need to be considered while the workflow is still easy to change."
  },
  visible: {
    kicker: "04 / Visibility",
    title: "Make the system explain itself",
    copy: "Logs, traces and metrics should answer useful questions about what happened, where a workflow stopped and what an operator can safely do next."
  },
  safe: {
    kicker: "05 / Delivery",
    title: "Make the next change less risky than the last",
    copy: "Tests, useful boundaries and incremental delivery matter because production software keeps changing long after the first version ships."
  }
};

const methodTabs = [...document.querySelectorAll("[data-method-key]")];
const methodKicker = document.querySelector("[data-method-kicker]");
const methodTitle = document.querySelector("[data-method-title]");
const methodCopy = document.querySelector("[data-method-copy]");

methodTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.methodKey;
    const content = methodContent[key];
    if (!content) return;

    methodTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    if (methodKicker) methodKicker.textContent = content.kicker;
    if (methodTitle) methodTitle.textContent = content.title;
    if (methodCopy) methodCopy.textContent = content.copy;
  });
});
