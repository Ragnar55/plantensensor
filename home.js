//#region IMPORTS

//#endregion IMPORTS

const homeTemplate = document.createElement("template")
homeTemplate.innerHTML = /*html*/`
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
        this.shadow = this.attachShadow({mode: "open"}) 
        this.shadow.append(homeTemplate.content.cloneNode(true))
        
    }
}

customElements.define('home-comp', homeComponent)