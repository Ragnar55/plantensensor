/*

----------------------------------dataPage

te ontvangen data:
    -temperatuur
    -luchtvochtigheid
    -vochtigheid aarde
    -fertiliteit aarde
    -licht
    -druk
    -leeftijd
    -baterij percentage
    -opladen
*/

class ContainerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
        `
        <div>
            <ul-component title="Plant" data-array='["temperatuur", "luchtvochtigheid", "vochtigheid aarde","fertiliteit aarde","licht","druk","leeftijd"]'></ul-component>
            <ul-component title="Sensor" data-array='["baterij percentage", "opladen"]'></ul-component>
        </div>
        `;
    }
}

customElements.define('container-component', ContainerComponent);

/*

-------------------------dataPage

*/
