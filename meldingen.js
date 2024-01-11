const homeTemplate = document.createElement("template")
homeTemplate.innerHTML = /*html*/`
    <style>
        #batterij{
            font-size: 1em;
            background-color: #FFFF33;
        }
        #water{
            font-size: 1em;
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

}

customElements.define('mdelingen-comp', meldingenComponent)