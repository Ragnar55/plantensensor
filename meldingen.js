//#region IMPORTS
import { laadData } from "./sensor.js";
//#endregion IMPORTS

const homeTemplate = document.createElement("template")
homeTemplate.innerHTML = /*html*/`
    <style>
        #batterij, #water{
            text-align: center;
            font-size: 1.3em;
            padding: 1em;
            margin-right: 5em;
            margin-left: 5em;
            width: fit-content;
            border-radius: 0.5em;
        }
        #batterij{
            background-color: #FFFF33;
        }
        #water{
            background-color: #0E87CC;
        }

    </style>
    <div id="meldingenBox">
        <h1 id="batterij">Let op: sensor x heeft een laag batterijniveau</h1>
        <h1 id="water">Let op: Plant x heeft water nodig</h1>
    </div>
`

class meldingenComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"}) 
        this.shadow.append(homeTemplate.content.cloneNode(true))
    }
    showBatteryMessage(){

    }
    showWaterMessage(){

    }
    connectedCallback()
    {        
        console.log("connected callback called");
        laadData();
    }
}

customElements.define('meldingen-comp', meldingenComponent)