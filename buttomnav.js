//#region IMPORTS
import "./sensor.js"//moet die laaddata doen
//#endregion IMPORTS

const bnavtemplate = document.createElement("template")
bnavtemplate.innerHTML = /*html*/`
    <style>
    ul {
        list-style-type: none;
        margin-top: 5em;
        padding: 0;
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
        background-color: green;
    }

    li button:hover:not(.active) {
        background-color: lightgreen;
        color: white;
    }

    .active {
        background-color: lightgreen;
    }
    </style>
    
    <ul id="bnavbar">
        <li><button id="table" class="button-style">Table</button></li>
        <li><button id="chart" class="button-style">Chart</button></li>
    </ul>
`

class bNavComponent extends HTMLElement
{
    constructor(){
        super();

        this.shadow = this.attachShadow({mode: "open"});
        this.shadow.append(bnavtemplate.content.cloneNode(true));
        
        this.button = this.shadowRoot.querySelectorAll("button");
    }

    displayChart(){
        const appShadow = document.querySelector('app-comp').shadowRoot;
        const pageContainer = appShadow.getElementById("pageContainer");

        // Clear existing components
        pageContainer.innerHTML = '';

        // Dynamisch een nieuw component aanmaken voor de id
        const tableComponent = document.createElement("chart-comp");

        pageContainer.appendChild(tableComponent);
        console.log("displayChart")
    }

    displayTable(sensorId){
        const appShadow = document.querySelector('app-comp').shadowRoot;
        const pageContainer = appShadow.getElementById("pageContainer");

        // Clear existing components
        pageContainer.innerHTML = '';

        // Dynamisch een nieuw component aanmaken voor de id
        const sensorComponent = document.createElement("sensor-comp");
        sensorComponent.setAttribute("id", sensorId);

        pageContainer.appendChild(sensorComponent);
        console.log("displayTable")
    }

    connectedCallback()
    {
        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                console.log("bnav btn Clicked")
                this.ChangePageEvent(btn.getAttribute("id"))
            });
        });
    }

    ChangePageEvent(id){
        if (id === "chart") {
            this.displayChart();
        } 
        else if (id === "table") {
            this.displayTable();
        }

        this.dispatchEvent(new CustomEvent("ChangePageEvent", {
            bubbles: true,
            composed: true,
            detail: id
        }));
    }
}

customElements.define('bnav-comp', bNavComponent);