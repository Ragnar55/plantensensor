
class UlComponent extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title');
        const dataArray = JSON.parse(this.getAttribute('data-array')) || [];

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
        
        `
        <style>
            ul {
                list-style-type: none;
                padding: 0;
            }

        </style>
        <div>
            <h1>${title}</h2>
            <ul>
                ${dataArray.map(item => `<li-component>${item}</li-component>`).join('')}
            </ul>
        </div>
        `;
    }
}

customElements.define('ul-component', UlComponent);

/*

--------------------------------dataContainer

*/

