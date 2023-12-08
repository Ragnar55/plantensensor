//#region IMPORTS

//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
        h1{
            color: blue;
        }
    </style>
    <h1>hello i am the home page</h1>
`

class homeComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"}) // zorgt ervoor dat het component een afgeschermde stijl kan hebben
        this.shadow.append(template.content.cloneNode(true))
        
    }
}

customElements.define('home-comp', homeComponent)