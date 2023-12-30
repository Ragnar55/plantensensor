/*

------------------------dataItem

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
         <style>

        li {
            background-color: #fff;
            margin: 10px 0;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    </style>
        <li>
            <slot></slot>
        </li>
    `;
    }
}

customElements.define('li-component', LiComponent);

    /*

------------------------------dataItem

class dataItem{
    constructor(){
        super()
        const shadow = this.attachShadow({mode:"open"})
        shadow.append(dataTestItem.content.cloneNode(true))
    }
}

customElements.define("data-item", dataItem)
*/