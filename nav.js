//#region IMPORTS

//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    ul {
        list-style-type: none;
        margin-top: 5em;
        padding: 0;
        width: 7em;
        overflow: hidden;
        background-color: #333;
    }

    li button {
        display: block;
        color: none;
        text-align: center;
        padding: 2em 1em;
        text-decoration: none;
        width: 100%;
    }

    li button:hover:not(.active) {
        background-color: green;
        color: white;
    }

    .active {
        background-color: #04AA6D;
    }
    </style>

<ul id="navbar">
  <li><button id="home">Home</button></li>
  <li><button id="add">+</button></li>
</ul>
`

class navComponent extends HTMLElement
{
    constructor(){
        super();

        this.shadow = this.attachShadow({mode: "open"});
        this.shadow.append(template.content.cloneNode(true));
        
        this.button = this.shadowRoot.querySelectorAll("button");
        this.counter = 1; //de nieuwe button counter op "1" instellen

        // nieuwe sensorbutton toevoegen
        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                console.log("btn Clicked");
                if (btn.getAttribute("id") === "add"){
                    this.addNewSensor();
                }
                else {
                    this.ChangePageEvent(btn.getAttribute("id"));
                }
            });
        });
    }
    
    addHomeComponent() {
        const existingHomeComponent = this.shadowRoot.querySelector("#pageContainer home-comp");
        
        if (!existingHomeComponent) {
            const homeComponent = document.createElement("home-comp");
            homeComponent.setAttribute("id", "home");

            const appShadow = document.querySelector('app-comp').shadowRoot;
            const pageContainer = appShadow.getElementById("pageContainer");

            pageContainer.appendChild(homeComponent);

            // Clear existing components
            pageContainer.innerHTML = '';
            pageContainer.appendChild(homeComponent);
            this.currentPage = homeComponent;
        }
    }

    addNewSensor(){
        const newLi = document.createElement("li");
        const newSensor = document.createElement("button");

        //knop tekst + id instellen
        newSensor.textContent = `Sensor ${this.counter}`;
        newSensor.setAttribute("id", `sensor${this.counter}`);
        this.counter++;
        
        //knop voor de "+" button zetten
        const addSensor = this.shadowRoot.querySelector("#add");
        this.shadowRoot.querySelector("ul").insertBefore(newLi, addSensor.parentNode);
        newLi.appendChild(newSensor);

        //eventlistener toevoegen aan de nieuwe buttons
        newSensor.addEventListener('mousedown', (event) =>{
            const sensorId = newSensor.getAttribute("id");
            this.ChangePageEvent(sensorId);
        });

        //optie om de sensor een andere naam te geven
        newSensor.addEventListener('contextmenu', (event) =>{
            event.preventDefault();

            const newName = prompt('Enter a new name for the sensor:', newSensor.textContent);
            if (newName !== null){
                newSensor.textContent = newName
            }
        });
    }
    
    displaySensor(sensorId){
        const appShadow = document.querySelector('app-comp').shadowRoot;
        const pageContainer = appShadow.getElementById("pageContainer");

        // Clear existing components
        pageContainer.innerHTML = '';

        // Dynamisch een nieuw component aanmaken voor de id
        const sensorComponent = document.createElement("sensor-comp");
        sensorComponent.setAttribute("id", sensorId);

        pageContainer.appendChild(sensorComponent);
        console.log("displaySensor")
    }
    

    connectedCallback()
    {
        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                console.log("nav btn Clicked")
                this.ChangePageEvent(btn.getAttribute("id"))
            });
        });
    }

    ChangePageEvent(id){
        if (id === "home") {
            this.addHomeComponent();
        } 
        else if (id.startsWith("sensor")) {
            console.log("Displaying sensor:", id);
            this.displaySensor(id);
        }

        this.dispatchEvent(new CustomEvent("ChangePageEvent", {
            bubbles: true,
            composed: true,
            detail: id
        }));
    }
}

customElements.define('nav-comp', navComponent);