//#region IMPORTS

//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <h1>hello i am the button</h1>
    
`

class App extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
        this.shadow.append(template.content.cloneNode(true))

        // Initial HTML content
        this.shadowRoot.innerHTML = `
            <ul id="navbar">
                <li><button id="home">Home</button></li>
                <li><button id="add">+</button></li>
            </ul>
        `;
        
        // Bind the click event to the method
        this.shadowRoot.getElementById('add').addEventListener('click', this.addNewButton.bind(this));
    }

    //methode om nieuwe button te adden
    addNewButton() {
        // Create a new li element
        var newLi = document.createElement("li");

        // Create a new button element
        var newButton = document.createElement("button");

        // Set the button text and attributes
        newButton.textContent = "New Button";
        newButton.setAttribute("id", "newButton");

        // Append the button to the li element
        newLi.appendChild(newButton);

        // Append the li element to the navbar
        this.shadowRoot.querySelector("#navbar").appendChild(newLi);
    }
}

// Define the custom element
customElements.define('button-app', App);