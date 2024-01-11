const homeTemplate = document.createElement("template")
homeTemplate.innerHTML = /*html*/`
    <style>
        h1 {
            text-align: center;
            font-size: 3em;
        }
        h2 {
            text-align: center;
            font-size: 2.5em;
        }
    </style>
    <div id="meldingenBox">
        <h1>Let op: sensor x heeft een laag batterijniveau</h1>
        <h1>Let op: Plant x heeft water nodig</h1>
    </div>
`

class meldingenComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"}) 
        this.shadow.append(homeTemplate.content.cloneNode(true))
    }

}

customElements.define('mdelingen-comp', meldingenComponent)