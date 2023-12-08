/*
const dataTestItem = document.createElement("dataTestItem")
dataTestItem.innerHTML =/*html*//*
    `
    <style>
        li, ul {
            list-style-type: none;
            padding: 0;
            margin: 0; 
        }
    </style>
    <slot>
    </slot>
    `
*/
class LiComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML =/*html*/
         `
        <li>
            <slot></slot>
        </li>
    `;
    }
}

customElements.define('li-component', LiComponent);

    /*
class dataItem{
    constructor(){
        super()
        const shadow = this.attachShadow({mode:"open"})
        shadow.append(dataTestItem.content.cloneNode(true))
    }
}

customElements.define("data-item", dataItem)
*/