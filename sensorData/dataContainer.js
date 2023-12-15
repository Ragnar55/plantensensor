/*
te ontvangen data:
    -temperatuur
    -luchtvochtigheid
    -vochtigheid aarde
    -fertiliteit aarde
    -licht
    -baterij percentage
    -opladen
*/

//manier om data mee te krijgen vannuit data page zodat er voor elke data
//een li comp is met een array ofso?
class UlComponent extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title');
        const dataArray = JSON.parse(this.getAttribute('data-array')) || [];

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
        `
        <div>
            <h2>${title}</h2>
            <ul>
                ${dataArray.map(item => `<li-component>${item}</li-component>`).join('')}
            </ul>
        </div>
        `;
    }
}

customElements.define('ul-component', UlComponent);