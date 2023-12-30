/*
    mischien is leeftijd nog te berekenen?
*/
var temp=21;
var humidity=83;
var light_intensity=500;

class ContainerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
        `
        <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f8f8;
            margin: 20px;
        }

        ul {
            list-style-type: none;
            padding: 0;
        }
        </style>
        <div>
            <ul-component title="Plant" data-array='["${humidity}%","aarde","zout", "${light_intensity} lux","hoogte","druk","${temp}°C"]'></ul-component>
            <ul-component title="Sensor" data-array='["baterij percentage"]'></ul-component>
        </div>
        `;
    }
}

customElements.define('container-component', ContainerComponent);