// sensor.js
const sensorTemplate = document.createElement("template");
sensorTemplate.innerHTML = /*html*/`
    <style>
        h1 {
            color: blue;
        }
    </style>
    <h1>hello, I am the sensor page</h1>
    <container-component></container-component>
`;

class SensorComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(sensorTemplate.content.cloneNode(true));
    }
}

customElements.define('sensor-comp', SensorComponent);

// dataPage.js
var humidity = 83;
var soil="tf moet hier";
var salt="ook wat hier";
var light_intensity = 500;
var altitude= 55;
var pressure=100;
var temperature = 21;

var batterij=65;

class ContainerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
            `

        <div>
            <ul-component title="Plant" data-array='["<strong>Vochtigheid:</strong> ${humidity}%"," ${soil} aarde"," ${salt} zout", "${light_intensity}lux","${altitude}m","${pressure}Pa","${temperature}°C"]'></ul-component>
            <ul-component title="Sensor" data-array='[" Batterij: ${batterij}%"]'></ul-component>
        </div>
        `;
    }
}

customElements.define('container-component', ContainerComponent);

// dataItem.js
class LiComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
            `
        <style>
            li {
                background-color: #fff;
                margin: 10px 0;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
            }

        </style>
        <li>
            <slot></slot>
        </li>
    `;
    }
}

customElements.define('li-component', LiComponent);

// dataContainer.js
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
            <h1>${title}</h1>
            <ul>
                ${dataArray.map(item => `<li-component>${item}</li-component>`).join('')}
            </ul>
        </div>
        `;
    }
}

customElements.define('ul-component', UlComponent);
