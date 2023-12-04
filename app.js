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
        this.pageContainer = this.shadowRoot.querySelector("#pageContainer");

        this.addEventListener("ChangePageEvent", this.ChangePageEvent.bind(this));
    }

    ChangePageEvent(e){
        console.log("btnPress Received " + e.detail);

        this.showPages(e.detail);
    }

    showPages(page)
    {

        this.pageContainer.innerHTML = '';

        // Check if the page is already cached
        if (this.cachedPages.indexOf(page) !== -1) {
            console.log("Already cached: " + page);
        } else {
            // Cache the page
            this.cachedPages.push(page);
            console.log(`Cached ${page}`);

            // Create and append the new page
            let newPage = document.createElement(`${page}-comp`);
            newPage.setAttribute("id", page);
            this.pageContainer.appendChild(newPage);
        }
        console.log(this.cachedPages);
    }
    
}

customElements.define('app-comp', app)