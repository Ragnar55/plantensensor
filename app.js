//#region IMPORTS
import "./nav.js"
import "./home.js"
import "./sensor.js"
import "./sidenav.js"
import "./sensorCharts.js"
//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    #pageContainer {
        margin-top: 5em;
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
    }
    #pageAndbNAv {
        display: flex;
        width: 100%;
    }
    </style>
    <h1>Plantensensor</h1>

    <div id="navContainer">
        <nav-comp></nav-comp>
    </div>
    
    <div id="pageAndbNAv">
        <div id="pageContainer"></div>
        <div id="bNavContainer">
            <bnav-comp></bnav-comp>
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
    }
}

customElements.define('app-comp', app)