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

        this.shadow = this.attachShadow({mode: "open"}); // zorgt ervoor dart het component een afgeschermde stijl kan hebben
        this.shadow.append(template.content.cloneNode(true));
        
        this.button = this.shadowRoot.querySelectorAll("button");
        this.counter = 1; //de nieuwe button counter op "1" instellen

        //// check if pageContainer exists
        this.logPageContainerExistence();
        ////

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
        this.shadowRoot.querySelectorAll("#navbar li button[id^='sensor']").forEach(sensorBtn => {
            sensorBtn.addEventListener('click', (e) => {
                const sensorId = sensorBtn.getAttribute("id");
                this.displaySensor(sensorId);
            });
        });
    }

    ///////////////////////////
    logPageContainerExistence(){
        const pageContainer = this.shadowRoot.getElementById("pageContainer");
        console.log("#pageContainer exists:", pageContainer !== null);
    }
    ///////////////////////////
    addHomeComponent() {
        const homeComponent = document.createElement("home-comp");
        homeComponent.setAttribute("id", "home");

        const appShadow = document.querySelector('app-comp').shadowRoot;
        const pageContainer = appShadow.getElementById("pageContainer");
        
        if(!pageContainer){
            console.error("#pageContainer not found");
            return;
        }
        pageContainer.appendChild(homeComponent);
    }

    addNewSensor(){
        const newLi = document.createElement("li");
        const newSensor = document.createElement("button");

        //knop tekst + id instellen
        newSensor.textContent = "New Sensor";
        newSensor.setAttribute("id", `sensor${this.counter}`);
        this.counter++;
        
        //knop voor de "+" button zetten
        const addSensor = this.shadowRoot.querySelector("#add");
        this.shadowRoot.querySelector("ul").insertBefore(newLi, addSensor.parentNode);
        newLi.appendChild(newSensor);

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
        const pageContainer = this.shadowRoot.getElementById("pageContainer");

        // Pagina leegmaken
        pageContainer.innerHTML = '';

        // Dynamisch een nieuw component aanmaken voor de id
        const sensorComponent = document.createElement("sensor-comp");
        sensorComponent.setAttribute("id", sensorId);
        pageContainer.appendChild(sensorComponent);
    }
    

    connectedCallback()
    {
        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                console.log("btn Clicked")
                this.ChangePageEvent(btn.getAttribute("id"))
            });
        });
    }

    ChangePageEvent(id){
        if (id === "home") {
            this.addHomeComponent();
        } else if (id.startsWith("sensor")) {
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