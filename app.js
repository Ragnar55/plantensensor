//#region IMPORTS
import "./nav.js"
import "./home.js"
import "./sensor.js"
//#endregion IMPORTS

const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
    
    :host {
        display: flex;
    }
    
    nav-comp,
    home-comp{
        flex: 0.2; 
    }
    
    #pageContainer {
        background: black;
        display: flex;
        flex-direction: column; 
    }

    </style>

    <nav-comp></nav-comp>
    <div id="mainPage"></div>
    <div id="pageContainer"></div>
`

class app extends HTMLElement
{
    constructor(){
        super()
        const shadow = this.attachShadow({mode: "open"}) // zorgt ervoor dart het component een afgeschermde stijl kan hebben
        shadow.append(template.content.cloneNode(true))

        this.cachedPages = [];
        this.currentPage = "";
        this.mainPage = this.shadowRoot.querySelector("#mainPage");

        this.addEventListener("ChangePageEvent", this.ChangePageEvent.bind(this));
    }

    ChangePageEvent(e){
        console.log("btnPress Received " + e.detail);

        this.showPages(e.detail);
    }

    showPages(page)
    {

        for(let oldPage of this.cachedPages){
            this.shadowRoot.querySelector(`#${oldPage}`).style.display = "none";    
        }

        if(this.cachedPages.indexOf(page) !== -1){
            console.log("i already cached! " + page)
            
            this.shadowRoot.querySelector(`#${page}`).style.display = "block";
        }
        else{
            this.cachedPages.push(page) 
            console.log(`the ${page} has been chached`)
            
            let newPage = document.createElement(`${page}-comp`);
            newPage.setAttribute("id", page)

            this.mainPage.append(newPage)

        }
        console.log(this.cachedPages);

        
    }
    
}

customElements.define('app-comp', app)