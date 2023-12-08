class ContainerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
        `
        <div>
            <ul-component title="plant"></ul-component>
            <ul-component title="sensor"></ul-component>
        </div>
    `;
    }
}

customElements.define('container-component', ContainerComponent);