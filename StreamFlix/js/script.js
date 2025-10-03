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
                }" class="w-full h-48 object-cover mb-4 rounded my-5 mx-2">
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
