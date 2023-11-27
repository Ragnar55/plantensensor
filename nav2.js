//#region IMPORTS

//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    ul {
        list-style-type: none;
        margin-top: 5em;
        padding: 0;
        width: 5em;
        overflow: hidden;
        background-color: #333;
    }

    li {
        display: inline-block;
    }

    li button {
        display: block;
        color: none;
        text-align: center;
        padding: 2em 1em;
        text-decoration: none;
        width: 100%;
    }

    li button:hover:not(.active) {
        background-color: green;
        color: white;
    }

    .active {
        background-color: #04AA6D;
    }
    </style>

<ul>
  <li><button id="home">Home</button></li>
  <li><button id="add">+</button></li>
</ul>
`

class app extends HTMLElement
{
    constructor(){
        super();

        this.shadow = this.attachShadow({mode: "open"}) // zorgt ervoor dart het component een afgeschermde stijl kan hebben
        this.shadow.append(template.content.cloneNode(true))
        
        this.button = this.shadowRoot.querySelectorAll("button")

        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                console.log("btn Clicked");
                if (btn.getAttribute("id") === "add"){
                    this.addNewButton();
                }
                else {
                    this.ChangePageEvent(btn.getAttribute("id"));
                }
            });
        });
    }

    addNewButton(){
        const newLi = document.createElement("li");

        const newButton = document.createElement("button");

        newButton.textContent = "New Button";
        newButton.setAttribute("id", "newButton");

        newLi.appendChild(newButton);
        this.shadowRoot.querySelector("ul").appendChild(newLi);
    }
    


    connectedCallback()
    {
        this.button.forEach(btn => {
            btn.addEventListener('mousedown', (e) =>{
                console.log("btn Clicked")
                this.ChangePageEvent(btn.getAttribute("id"))
            })
        });
    }

    ChangePageEvent(id){
        this.dispatchEvent(new CustomEvent("ChangePageEvent", {
            bubbles: true,
            composed: true,
            detail: id
        }))
    }
}

customElements.define('nav-comp', app);