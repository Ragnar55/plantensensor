//#region IMPORTS

//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
        h1{
            color: blue;
        }
    </style>
    <h1>hello i am the sensor page</h1>
`

class sensorComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"})
        this.shadow.append(template.content.cloneNode(true))
        
    }
}

customElements.define('sensor-comp', sensorComponent)