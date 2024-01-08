// sensor.js
const sensorTemplate = document.createElement("template");
sensorTemplate.innerHTML = /*html*/`
    <style>
        h1 {
            color: blue;
        }
    </style>
    <container-component></container-component>
`;

class SensorComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(sensorTemplate.content.cloneNode(true));
        laadData();//steekt meest recente data in variabele
    }
}

customElements.define('sensor-comp', SensorComponent);

// dataPage.js
// data in var steken 
var humidity = 0;
var soil = 0;
var salt = 0;
var light_intensity = 0;
var altitude = 0;
var pressure = 0;
var temperature = 0;

var batterij = 0;

function laadData(){//steekt normaal alle data in console en kijkt ook na welke data het juist is
    fetch("http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors")//als die /api/GetAllDataFromSpecifiedSensor/:sensorId zou werken ma iets is mis me die id
                .then(response => response.json())
                .then(data => {

                    const sensorId2Data = data.filter(entry => entry.sensorId === 5);// hier is sensor,2 moet nog vervangen worden met de geselecteerde sensor

                    // Create a map to store the latest entry for each type
                    const latestEntriesMap = new Map();

                    sensorId2Data.forEach(entry => {//gwn laatste data entry vinden
                        const currentLatest = latestEntriesMap.get(entry.type);
                        if (!currentLatest || new Date(entry.timestamp) > new Date(currentLatest.timestamp)) {
                            latestEntriesMap.set(entry.type, entry);
                        }
                    });

                    latestEntriesMap.forEach(entry => { // in console om te zien of et wel juist is, opnieuw alleen de laatste
                        var test = `Type: ${entry.type}, Value: ${entry.value}, Timestamp: ${entry.timestamp}`;
                        console.log(test);
                        
                    });

                    latestEntriesMap.forEach(entry => {
                        switch (entry.type) {
                            case "humidity":
                                humidity = entry.value;
                                break;
                            case "soil":
                                soil = entry.value;
                                break;
                            case "salt":
                                salt = entry.value;
                                break;
                            case "lux":
                                light_intensity = entry.value;
                                break;
                            case "altitude":
                                altitude = entry.value;
                                break;
                            case "pressure":
                                pressure = entry.value;
                                break;
                            case "temperature":
                                temperature = entry.value;
                                break;
                            case "battery":
                                batterij = entry.value;
                                break;
                        }
                    });


                    
                })
                .catch(error => console.error("Error fetching data:", error));
}



class ContainerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });//hierna word data+voorzetsel megegeven 
        this.shadowRoot.innerHTML = /*html*/
            `
        <style>
            
            div{
                margin: 2em;
            }
        </style>
        <div>
            <ul-component title="Plant" item-array='["Vochtigheid:"," Grond:"," Zoutgehalte:"," Lichtintensiteit:"," Hoogte:"," Druk:"," Temperatuur:"]'
                                        data-array='["${humidity}%"," ${soil} aarde"," ${salt} zout", "${light_intensity}lux","${altitude}m","${pressure}Pa","${temperature}°C"]'>
                <!--
                <img src="/img/pressure.png" alt="Image"> is juist
                <img src="../img/humidity.png" alt="Image">
                <img src="../img/height.png" alt="Image">
                <img src="../img/light.png" alt="Image">                
                <img src="../img/termometer.png" alt="Image">
                -->
            </ul-component>

            <ul-component title="Sensor" item-array='[" Batterij:"]' data-array='["${batterij}%"]'>
                <!--
                <img src="../img/battery.png" alt="Image">
                <img src="../img/logo.png" alt="Image">
                -->
            </ul-component>
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
                border-radius: 4px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                font-family: 'Nunito', sans-serif;
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
        const itemArray = JSON.parse(this.getAttribute('item-array')) || [];

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/
            `
        <style>
            ul {
                list-style-type: none;
                padding: 0;
            }
            .flex-container {
                display: flex;
                flex-direction: column;
                border: 3px solid #fff;
                align-items: center;
                justify-content: center;
            }
            .flex-title-child{
                width: 100%;
            }
            .flex-children {
                display: flex;
                flex-direction: row;
            }
            .flex-child {
                padding: 0.05em;
                width: 9em;
                box-sizing: border-box;
            } 
            strong {
            color: #2E7D32;        
            }
        </style>
        <div class="flex-container">
            <div class="flex-title-child">
                <h1>${title}</h1>
            </div>

            <div class="flex-children">
                <div class="flex-child">
                    <ul>
                        ${Array.from(this.children).map(child => `<img src="${child.innerText}">`).join('')}
                    </ul>
                </div>

                <div class="flex-child">
                    <ul>
                        ${itemArray.map(item => `<li-component><strong>${item}</li-component></strong>`).join('')}
                    </ul>
                </div>

                <div class="flex-child">
                    <ul>
                        ${dataArray.map(item => `<li-component>${item}</li-component>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('ul-component', UlComponent);
