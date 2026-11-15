// PhishLab interactions: mobile navigation and active-section tracking.
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

// Open/close the sidebar on smaller screens.
menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu after a navigation link is selected.
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Highlight the navigation item for the section currently on screen.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const pointsToCurrentSection = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", pointsToCurrentSection);
      });
    });
  },
  { rootMargin: "-25% 0px -65% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));



// Dataset subsection accordion
const subsectionToggles = document.querySelectorAll(".subsection-toggle");

subsectionToggles.forEach((toggle) => {

    toggle.addEventListener("click", () => {

        const content = toggle.nextElementSibling;

        const isExpanded = toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute("aria-expanded", !isExpanded);

        content.hidden = isExpanded;

    });

});