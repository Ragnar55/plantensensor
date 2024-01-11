//#region IMPORTS
import "./sensor.js"//moet die laaddata doen
//#endregion IMPORTS

function getSensorIds(sensorData) {
    const uniqueIds = new Set();
    sensorData.forEach(data => {
        uniqueIds.add(data.sensorId);
    });
    return Array.from(uniqueIds);
}

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    ul {
        list-style-type: none;
        margin-top: 5em;
        padding-left: 2em;
        width: 7em;
        overflow: hidden;
        width: 100%;
    }
    li {
       display: inline-block;
       white-space: nowrap;
    }

    .button-style {
        border-radius: 1em;
        font-size: 1.05em;
        text-align: center;

        width: 2em;
        display: inline-block;
        
        padding: 1.5em;
        margin-right: 1em;
        text-decoration: none;
        width: 8em;
        background-color: #A4DEDF;
    }

    li button:hover:not(.active) {
        background-color: #BEE7E8;
    }

    </style>
    
    <ul id="navbar">
        <li><button id="home" class="button-style">Home</button></li>
    </ul>
`

class navComponent extends HTMLElement
{
    constructor(){
        super();

        this.shadow = this.attachShadow({mode: "open"});
        this.shadow.append(template.content.cloneNode(true));
        
        this.button = this.shadowRoot.querySelectorAll("button");
        this.currentPage = null;

        this.homeComponentAdded = false;

        // nieuwe sensorbutton toevoegen
        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                console.log("btn Clicked");
                    this.ChangePageEvent(btn.getAttribute("id"));
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

            // Clear existing components
            pageContainer.innerHTML = '';

            pageContainer.appendChild(homeComponent);
            this.currentPage = homeComponent;
            document.querySelector('app-comp').hideBNav();
        }
    }

    addSensors(){
        const availableSensors = this.uniqueSensorIds;
        const navbar = this.shadowRoot.getElementById("navbar");

        availableSensors.forEach(sensorId => {
            const newLi = document.createElement("li");
            const newSensor = document.createElement("button");
            newSensor.classList.add("button-style");

            //knop tekst + id instellen
            newSensor.textContent = `Sensor ${sensorId}`;
            newSensor.setAttribute("id", `sensor${sensorId}`);

            navbar.appendChild(newLi);
            newLi.appendChild(newSensor);

            //eventlistener toevoegen aan de nieuwe buttons
            newSensor.addEventListener('mousedown', (event) =>{
                this.ChangePageEvent(sensorId);
            });
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

        this.currentPage = sensorComponent;
        document.querySelector('app-comp').showBNav();
    }

    laadData(){
        console.log('loading data...');
        fetch("http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors")// haalt alles op
        .then(response => response.json())
        .then(data => {
            this.sensorData = data instanceof Array ? data : [data];
            this.uniqueSensorIds = getSensorIds(this.sensorData);

            console.log("sensor ids", this.uniqueSensorIds);
            
            this.addHomeComponent(); //voor this.homeComponentAdded = true, anders krijg je errors
            this.addSensors();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }

    connectedCallback()
    {        
        console.log("connected callback called");
        this.laadData();

        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                this.ChangePageEvent(btn.getAttribute("id"))
            }, {once: true}); //voorkomt dat er 2 eventlisteners met de home button verbonden zijn
        });

        if (!this.homeComponentAdded) {
            this.homeComponentAdded = true;
        }
    }

    ChangePageEvent(id){
        console.log("ChangePageEvent called for ID:", id);
        if (id === "home") {
            this.addHomeComponent();
            return;
        } 
        else{
            console.log("Displaying sensor:", id);
            const lastId = this.getCurrentSensorId();
            this.setCurrentSensorId(id);
            const currentId = this.getCurrentSensorId();

            if (currentId != lastId){
                this.displaySensor(currentId);
            }
            else{
                return;
            }
        }
        
        this.dispatchEvent(new CustomEvent("ChangePageEvent", {
            bubbles: true,
            composed: true,
            detail: id
        }));
    }
    
    setCurrentSensorId(sensorId){
        sessionStorage.setItem('currentSensorId', sensorId)
    }
    getCurrentSensorId(){
        return sessionStorage.getItem('currentSensorId');
    }
}

customElements.define('nav-comp', navComponent);