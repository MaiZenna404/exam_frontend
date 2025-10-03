// --- Fetch local JSON ---
const DATA_JSON_FILE = "./data.json";

async function fetchProjects() {
  const resp = await fetch(DATA_JSON_FILE, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  if (!resp.ok) throw new Error(`Error fetching projects: ${resp.status}`);
  const data = await resp.json();
  return data.projects;
}

// --- Modal helpers ---
function openModal(content) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = content;
  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.classList.add("hidden");
}

// --- Render + listeners ---
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded");

  const portfolioSection = document.querySelector("#projects-container");
  const closeModalButton = document.querySelector("#close-modal");
  const modal = document.getElementById("modal");

  // 1) Attache les listeners de fermeture de la modale
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => closeModal());
  }
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(); // click sur l’overlay
  });

  // 2) Sécurise la validation du formulaire (si présent sur cette page)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      const emailInput = document.getElementById("email");
      const emailRegExPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailInput.value.match(emailRegExPattern)) {
        event.preventDefault();
        alert("Veuillez entrer une adresse email valide.");
        return;
      }
      // Ici tu peux ouvrir une vraie modale de succès si tu veux
      alert("Formulaire valide !");
    });
  }

  // 3) Rendu des projets (une seule fois)
  try {
    const projects = await fetchProjects();
    projects.forEach((project) => {
      const el = document.createElement("div");
      el.className = "project-item";
      el.innerHTML = `
        <div class="card p-4 shadow-lg bg-white rounded-lg max-w-fit cursor-pointer">
          <h3 class="p-3 font-semibold">${project.title}</h3>
          <img src="${project.image}" alt="icône ${project.title}" class="w-full h-48 object-cover mb-4 rounded my-5">
          <p class="p-3">${project.description}</p>
          <div class="badges-technologies">
            ${project.technologies
              .map(
                (t) => `
                <span class="inline-flex items-center rounded-md text-[var(--text-color)] bg-[var(--calm-teal)] px-2 py-1 text-xs font-medium inset-ring inset-ring-gray-400/20">
                  ${t}
                </span>`
              )
              .join("")}
          </div>
        </div>`;
      // Ouvre la modale au clic
      el.addEventListener("click", () => {
        const content = `
          <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
          <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover mb-4 rounded">
          <p class="mb-2">${project.description}</p>
          <p><strong>Technologies :</strong> ${project.technologies.join(", ")}</p>`;
        openModal(content);
      });
      portfolioSection.appendChild(el);
    });
  } catch (e) {
    console.error("Error rendering projects:", e);
  }

  // 4) Search bar (inchangé)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const projectItems = document.querySelectorAll(".project-item");
      let hasVisible = false;
      projectItems.forEach((item) => {
        const techBadges = item.querySelectorAll(".badges-technologies span");
        const match = Array.from(techBadges).some((b) =>
          b.textContent.toLowerCase().includes(searchTerm)
        );
        item.style.display = match ? "block" : "none";
        if (match) hasVisible = true;
      });
      const noItems = document.getElementById("no-items-found");
      if (noItems) noItems.classList.toggle("hidden", hasVisible);
    });
  }
});