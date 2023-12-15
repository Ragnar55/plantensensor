//#region IMPORTS
import "./dataContainer.js"
import "./dataItem.js"
import "./dataPage.js"
//#endregion IMPORTS

const sensorTemplate = document.createElement("template")
sensorTemplate.innerHTML = /*html*/`
    <style>
        h1{
            color: blue;
        }
    </style>
    <h1>hello i am the sensor page</h1>
    <container-component></container-component>
`

class sensorComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"})
        this.shadow.append(sensorTemplate.content.cloneNode(true))
        
    }
}

customElements.define('sensor-comp', sensorComponent)