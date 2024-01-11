//#region IMPORTS
import { laadData } from "./sensor.js";//moet die laaddata doen
//#endregion IMPORTS

function getSensorIds(sensorData) {
    const uniqueIds = new Set();
    sensorData.forEach(data => {
        uniqueIds.add(data.sensorId);
    });
    return Array.from(uniqueIds);
}
function setCurrentSensorId(sensorId){
    sessionStorage.setItem('currentSensorId', sensorId)
}
function getCurrentSensorId(){
    return sessionStorage.getItem('currentSensorId');
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
    }
    
    addHomeComponent() {
        const homeComponent = document.createElement("home-comp");
        homeComponent.setAttribute("id", "home");

        const appShadow = document.querySelector('app-comp').shadowRoot;
        const pageContainer = appShadow.getElementById("pageContainer");

        // Clear existing components
        pageContainer.appendChild(homeComponent);
        this.currentPage = homeComponent;
        document.querySelector('app-comp').hideBNav();
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

    laadIdData(){
        console.log('loading data...');
        fetch("http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors")// haalt alles op
        .then(response => response.json())
        .then(data => {
            this.sensorData = data instanceof Array ? data : [data];
            this.uniqueSensorIds = getSensorIds(this.sensorData);

            console.log("sensor ids", this.uniqueSensorIds);
////////////////////////////
            // Check if data is loaded for all unique sensor IDs
            const allDataLoaded = this.uniqueSensorIds.every(id => this.sensorData.some(data => data.sensorId === id));
            if (!allDataLoaded) {
                console.error("Not all data loaded for unique sensor IDs");
                return;
            }
////////////////////////////
            this.addHomeComponent(); //voor this.homeComponentAdded = true, anders krijg je errors
            this.addSensors();

            this.uniqueSensorIds.forEach(id => {
                laadData(id);
                console.log(`data loaded for id ${id}`);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }

    connectedCallback()
    {        
        console.log("connected callback called");
        this.laadIdData();
    }

    lastId = 0; //buiten changePageEvent declaren zodat lastId aangepast kan blijven worden
    ChangePageEvent(id){
        console.log("ChangePageEvent called for ID:", id);
        if (id == "home") {
            this.addHomeComponent();
        } 
        else{
            setCurrentSensorId(id);
            const currentId = getCurrentSensorId();
            if (currentId != this.lastId){
                this.lastId = currentId;
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
}

customElements.define('nav-comp', navComponent);