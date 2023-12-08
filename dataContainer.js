class UlComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML =/*html*/
        `
        
        <div>
        <h2>${this.getAttribute('title')}</h2>
        <ul>
            <li-component>Item 1</li-component>
            <li-component>Item 2</li-component>
            <li-component>Item 3</li-component>
        </ul>
        </div>
    `;
    }
}

customElements.define('ul-component', UlComponent);