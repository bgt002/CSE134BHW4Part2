// Define a custom element class called ProjectCard
class ProjectCard extends HTMLElement {
    constructor() {
        // Call the parent class constructor
        super();
        // Create a shadow DOM for encapsulation
        var shadow = this.attachShadow({ mode: 'open' });

        // Create a template for the custom element's HTML structure
        const template = document.createElement('template');
        template.innerHTML = `
            <!-- Styling for the custom element -->
            <style>
                /* Styling for the content of the card */
                .card-content {
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                    transition: 0.3s;
                    width: 40%;
                    text-align: center;
                }

                .card-content img{
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 5px;
                    width: 300px;
                    height: 200px;
                }

                /* Styling for the project name */
                h2 {
                    text-allign: center;
                }


                /* Styling for the project description */
                p {
                    font-style: italic;
                }
            </style>
            <!-- HTML structure for the custom element -->
            <div class="card-content">
                <h2 id="name"></h2>
                <img id="image" alt="Project Image">
                <p id="description"></p>
                <a id="link">Read More</a>
            </div>
        `;

        // Attach the template content to the shadow DOM
        shadow.appendChild(template.content.cloneNode(true));

        // Get references to the elements within the shadow DOM
        this.nameElement = shadow.querySelector('#name');
        this.imageElement = shadow.querySelector('#image');
        this.descriptionElement = shadow.querySelector('#description');
        this.linkElement = shadow.querySelector('#link');
    }

    // Method to add data to the custom element
    addElements(data) {
        this.nameElement.textContent = data.name;
        this.imageElement.src = data.image;
        this.descriptionElement.textContent = data.description;
        this.linkElement.href = data.link;
        this.linkElement.textContent = data.linkText || 'Read More';
    }
}

// Define the custom element
customElements.define('project-card', ProjectCard);

// Function to initialize the page
function init() {
    // Add event listeners to buttons
    let element = document.getElementById('loadLocal');
    element.addEventListener('click', function () {
            let projectCard = document.querySelector('project-card');
    let localJson = localStorage.getItem('data');

    if (localJson) {
        try {
            let jsonData = JSON.parse(localJson);
            projectCard.addElements(jsonData.record[0]);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
        }
    } else {
        console.log('No JSON data found in localStorage.');
    }
    });

    element = document.getElementById('loadRemote');
    element.addEventListener('click', function () {
        remote();
    });

    // Load local data on page load
    local();
}

// Function to load local data
function local() {
    let projectCard = document.querySelector('project-card');
    let localJson = localStorage.getItem('data');
    let jsonData = JSON.parse(localJson);
    projectCard.addElements(jsonData.record[0]);
}

// Function to fetch and load remote data
function remote() {
    let card = document.querySelector('project-card')
    fetch('https://api.jsonbin.io/v3/b/64cf02a0b89b1e2299cc105a', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": "$2b$10$6Z2k1FYvRElp1BXBTRO5ZObU7iCf9rIs9i49qGa32gCgcDWwXO8Xm"
        },
    })
    .then((response)=>{
        return response.json();
    })
    .then(data => {
        card.addElements(data.record)
    })
}

// Define local data and store it in localStorage
let localData = {
    record: [
        {
            name: 'Local Data',
            image: 'https://source.unsplash.com/random/',
            description: 'local data',
            link: 'https://jsonbin.io'
        }
    ]
};

let dataStringify = JSON.stringify(localData);
localStorage.setItem('data', dataStringify);

// Add event listener to execute init function when the DOM is loaded
window.addEventListener('DOMContentLoaded', init);