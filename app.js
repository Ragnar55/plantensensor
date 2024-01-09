//#region IMPORTS
import "./nav.js"
import "./home.js"
import "./sensor.js"
//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    
    #pageContainer {
        height: 50em;
        margin-top: 5em;
        margin-right: 2em;
        background: lightgray;
        display: flex;
    }
    h1 {
        text-align: center;
        font-size: 60px;
        margin: 0;
    }
    #navcontainer {
        display: flex;
        border: 1px solid red;
        padding: 2em;
    }

    </style>
    <h1>Plantensensor</h1>
    <div id="navContainer">
        <nav-comp></nav-comp>
    </div>
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