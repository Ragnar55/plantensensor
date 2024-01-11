const homeTemplate = document.createElement("template")
homeTemplate.innerHTML = /*html*/`
    <style>
        h1 {
            text-align: center;
            font-size: 3em;
        }
    </style>
    <h1>Active sensors:</h1>
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