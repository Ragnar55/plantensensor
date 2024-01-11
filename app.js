//#region IMPORTS
import "./nav.js"
import "./home.js"
import "./sensor.js"
import "./sidenav.js"
import "./sensorCharts.js"
import "./meldingen.js"
//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    #pageContainer {
        width: 200em;
        height: 100em;
        }
    h1 {
        text-align: center;
        font-size: 4em;
        background: lightgreen;
        margin: 0;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        width: 100%;
    }
    #bNavContainer {
        padding: 2em;
        margin-top: 5em;
        width: 24em;
    }
    #pageAndbNAv {
        display: flex;
        width: 100%;
    }
    </style>
    <h1>Plantensensor</h1>

    <div id="navContainer">
        <nav-comp></nav-comp>
        <meldingen-comp></meldingen-comp>
    </div>
    
    <div id="pageAndbNAv">
        <div id="pageContainer"></div>
        <div id="bNavContainer">
            <div id="bNavHideContainer">
                <bnav-comp></bnav-comp>
            </div>
        </div>
    </div>
`

class app extends HTMLElement
{
    constructor(){
        super()
        const shadow = this.attachShadow({mode: "open"}) // zorgt ervoor dat het component een afgeschermde stijl kan hebben
        shadow.append(template.content.cloneNode(true))

        this.pageContainer = shadow.getElementById("pageContainer");
        this.bNavHideContainer = shadow.getElementById("bNavHideContainer");

        this.hideBNav();
    }
    showBNav() {
        this.bNavHideContainer.style.display = "block";
    }

    hideBNav() {
        this.bNavHideContainer.style.display = "none";
    }
}

customElements.define('app-comp', app)