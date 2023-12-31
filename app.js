//#region IMPORTS
import "./nav.js"
import "./home.js"
import "./sensor.js"
//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    
    :host {
        display: flex;
    }
    nav-comp,
    home-comp,
    sensor-comp {
        flex: 0.2;
    }
    
    #pageContainer {
        height: 50em;
        margin-top: 5em;
        margin-right: 2em;
        background: lightgray;
        display: flex;
        flex-direction: column; 
        flex: 1;
    }
    </style>

    <nav-comp></nav-comp>
    <div id="pageContainer"></div>
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