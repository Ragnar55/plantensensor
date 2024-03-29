//#region IMPORTS
import { laadData, lowBattery, drySoil } from "./sensor.js";
//#endregion IMPORTS

const homeTemplate = document.createElement("template")
homeTemplate.innerHTML = /*html*/`
    <style>
        #meldingenBox{
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            margin-right: 5em;
            margin-left: 5em;
        }

        #batterij, #water{
            text-align: center;
            font-size: 1.3em;
            padding: 1em;
            width: fit-content;
            border-radius: 0.5em;
            display: flex;
            Margin-right: 0.5em;
            margin-left: 0.5em;
        }
        #batterij{
            background-color: #FFFF33;
        }
        #water{
            background-color: #0E87CC;
        }

    </style>
    <div id="meldingenBox"></div>
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

    checkIfMeldingenAreNeeded(){
        //console.log(`Low soil humidity for these sensors: ${drySoil}`);
        //console.log(`Low battery for these sensors: ${lowBattery}`);
        const meldingenbox = this.shadowRoot.getElementById('meldingenBox');

        //elke 10 sec wordt de code uitgevoerd, dus oude knoppen moeten verwijderd worden
        meldingenbox.querySelectorAll('#water, #batterij').forEach(button => button.remove());

        if (drySoil.length > 0){
            drySoil.forEach(id =>{          //gaat elk id van de array af
                if(typeof id === 'number'){ //zorgt ervoor da der alleen nummers toegevoegd kunnen worden, niet dat er een lege array toegevoegd wordt ofzo
                    const waterMelding = document.createElement('h1');

                    waterMelding.textContent = `Let op: Plant ${id} heeft water nodig`;
                    waterMelding.id = 'water';
                    waterMelding.dataset.sensorId = id;

                    meldingenbox.appendChild(waterMelding);
                }
            });
        }

        if (lowBattery.length > 0){
            lowBattery.forEach(id =>{
                if(typeof id === 'number'){    
                    const batterijMelding = document.createElement('h1');

                    batterijMelding.textContent = `Let op: sensor ${id} heeft een laag batterijniveau`;
                    batterijMelding.id = 'batterij';
                    batterijMelding.dataset.sensorId = id;

                    meldingenbox.appendChild(batterijMelding);
                }
            });
        }
    }
}

customElements.define('meldingen-comp', meldingenComponent)