//#region IMPORTS
import { laadData, lowBattery, drySoil } from "./sensor.js";
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
            display: flex;
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

        //checkIfMeldingenAreNeeded functie elke 10 seconden aanroepen
        this.intervalId = setInterval(this.checkIfMeldingenAreNeeded.bind(this), 10000);
    }
    
    connectedCallback()
    {        
        console.log("connected callback called");
        laadData();
    }
    checkIfMeldingenAreNeeded(){
        console.log(`Low soil humidity for these sensors: ${drySoil}`);
        console.log(`Low battery for these sensors: ${lowBattery}`);
        const meldingenbox = this.shadowRoot.getElementById('meldingenBox');

        if (drySoil.length > 0){
            drySoil.forEach(id =>{
                const waterMelding = document.createElement('h1');
                waterMelding.textContent = `Let op: Plant ${id} heeft water nodig`;
                waterMelding.id = 'water';
                meldingenbox.appendChild(waterMelding);
            });
        }

        if (lowBattery.length > 0){
            lowBattery.forEach(id =>{
                const batterijMelding = document.createElement('h1');
                batterijMelding.textContent = `Let op: sensor ${id} heeft een laag batterijniveau`;
                batterijMelding.id = 'batterij';
                meldingenbox.appendChild(batterijMelding);
            });
        }
    }
}

customElements.define('meldingen-comp', meldingenComponent)