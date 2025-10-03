// Function to fetch projects from the JSON file - CORS ERROR ENCOUNTERED
/*const BASE_URL = "https://gabistam.github.io/Demo_API/data/projects.json"

// Fetch projects from the JSON file
async function fetchProjects() {
    try { 
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error during fetch: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
    catch(err) {
        console.error('Fetch error: ', err);
        throw err;
    }
}
*/

// Path to local json file to avoid CORS issues during development
const DATA_JSON_FILE = "./data.json";

// Fetch projects from the local JSON file
async function fetchProjects() {
    try {
        const response = await fetch(`${DATA_JSON_FILE}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching projects: ${response.status}`);
        }
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}

// Render the portfolio section automatically with fetched projects
document.addEventListener("DOMContentLoaded", async () => {
    const portfolioSection = document.querySelector("#projects-container");
    try {
        const fetchedProjects = await fetchProjects();
        fetchedProjects.forEach((project) => {
            const projectElement = document.createElement("div");
            projectElement.classList.add("project-item");
            projectElement.innerHTML = `
                <div class="card p-4 shadow-lg bg-white rounded-lg max-w-fit">
                    <h3 class="p-3 font-semibold">${project.title}</h3>
                    <img src="${project.image}" alt="icône ${project.title
                }" class="w-full h-48 object-cover mb-4 rounded my-5">
                    <p class="p-3">${project.description}</p>
                    <div class="badges-technologies">
                    ${project.technologies
                    .map(
                        (techno) => `
        <span class="inline-flex items-center rounded-md text-[var(--text-color)] bg-[var(--calm-teal)] px-2 py-1 text-xs font-medium inset-ring inset-ring-gray-400/20">
            ${techno}
        </span>
    `
                    )
                    .join("")}
                    </div>
                </div>
            `;
            portfolioSection.appendChild(projectElement);
        });
    } catch (error) {
        console.error("Error rendering projects:", error);
    }
});

// Verify if .project-item elements exist and are clickable
async function verifyProjectItems() {
    const portfolioSection = document.querySelector("#projects-container");
    try {
        const fetchedProjects = await fetchProjects();
        fetchedProjects.forEach((project) => {
            const projectElement = document.createElement("div");
            projectElement.classList.add("project-item");
            projectElement.innerHTML = `
                <div class="card p-4 shadow-lg bg-white rounded-lg max-w-fit">
                    <h3 class="p-3 font-semibold">${project.title}</h3>
                    <img src="${project.image}" alt="icône ${project.title}" class="w-full h-48 object-cover mb-4 rounded my-5">
                    <p class="p-3">${project.description}</p>
                    <div class="badges-technologies">
                        ${project.technologies
                            .map(
                                (techno) => `
                                    <span class="inline-flex items-center rounded-md text-[var(--text-color)] bg-[var(--calm-teal)] px-2 py-1 text-xs font-medium inset-ring inset-ring-gray-400/20">
                                        ${techno}
                                    </span>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            `;
            portfolioSection.appendChild(projectElement);

            // Add a direct click listener for debugging
            projectElement.addEventListener("click", () => {
                // Open modal with project details
                const modalContent = `
                    <h3>${project.title}</h3>
                    <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover mb-4 rounded">
                    <p>${project.description}</p>
                    <p><strong>Technologies:</strong> ${project.technologies.join(", ")}</p>
                `;
                openModal(modalContent);
            });
        });
    } catch (error) {
        console.error("Error rendering projects:", error);
    }
}

// Call the function to verify project items
verifyProjectItems();

// Searchbar for searching and filtering through technologies
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const projectItems = document.querySelectorAll(".project-item");
    let hasVisibleItem = false;

    projectItems.forEach((item) => {
        const techBadges = item.querySelectorAll(".badges-technologies span");
        const hasMatch = Array.from(techBadges).some((badge) =>
            badge.textContent.toLowerCase().includes(searchTerm)
        );
        item.style.display = hasMatch ? "block" : "none";
        if (hasMatch) {
            hasVisibleItem = true;
        }
    });

    // Handle "No items found" if no items match
    const noItemsFoundCard = document.getElementById("no-items-found");
    if (!hasVisibleItem) {
        noItemsFoundCard.classList.remove("hidden"); // Show the card
    } else {
        noItemsFoundCard.classList.add("hidden"); // Hide the card
    }
});

// Validation for contact form (HTML5 validation used)
document.getElementById("contact-form").addEventListener("submit", function (event) { 
    const emailInput = document.getElementById("email");
    const emailRegExPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailInput.value.match(emailRegExPattern)) {
        event.preventDefault();
        alert("Veuillez entrer une adresse email valide.");
        return;
    }

    
});

// Modifier la validation du formulaire pour afficher la modale
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function (event) {
    const emailInput = document.getElementById("email");
    const emailRegExPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailInput.value.match(emailRegExPattern)) {
        event.preventDefault();
        alert("Veuillez entrer une adresse email valide.");
        return;
    }

    // Si tout est valide, afficher la modale
    alert("Formulaire valide !");
});

// Function to open the modal
function openModal(content) {
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = content;
    modal.classList.remove("hidden");
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        console.log("Closing modal"); // Debugging statement
        modal.classList.add("hidden");
    } else {
        console.error("Modal not found in the DOM.");
    }
}

// Ensure DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded"); // Debugging statement

    const closeModalButton = document.querySelector('#close-modal');
    const modal = document.getElementById("modal");

    if (closeModalButton) {
        console.log("Close button found:", closeModalButton); // Debugging statement
        closeModalButton.addEventListener("click", () => {
            console.log("Close button clicked"); // Debugging statement
            closeModal();
        });
    } else {
        console.error("Close modal button not found in the DOM.");
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            console.log("Modal background clicked"); // Debugging statement
            closeModal();
        }
    });
});
