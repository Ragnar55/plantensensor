// sensor.js

function getCurrentSensorId(){
    return sessionStorage.getItem('currentSensorId');
}

//alles van de sensor pagina webcomponent zelf
const sensorTemplate = document.createElement("template");
sensorTemplate.innerHTML = /*html*/`
    <container-component></container-component>
`;

class SensorComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(sensorTemplate.content.cloneNode(true));
        const huidigID = getCurrentSensorId();
        laadData(huidigID);
        //steekt meest recente data in variabele
        //moet hier eigelijk niet staan want pagina laadt eerst en dan pas de data, dus laat gewoon default vallues van hier beneden
    }
}

customElements.define('sensor-comp', SensorComponent);

// dataPage.js
//wat er in de data items staat
// data parameters
var humidity = 0;
var soil = 0;
var salt = 0;
var light_intensity = 0;
var altitude = 0;
var pressure = 0;
var temperature = 0;

var batterij = 0;

function laadData(id){//haalt alle data op,filterd ze, laat ze zien in console en zet ze in variabele, overschrijft de default values van hierboven + id moet megegeven worden
    fetch("http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllDataFromSpecifiedSensor?sensorId="+id)// haalt alles op
    //http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors
    //alle data
    //http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllDataFromSpecifiedSensor?sensorId=id
    //specifieke data van een sensor
    .then(response => response.json())//zet data om in JSON zodanig dat het hierbeneden beschikbaar en leesbaar is
    .then(data => {
        //const sensorId2Data = data.filter(entry => entry.sensorId === id);// hier is sensor,2 moet nog vervangen worden met de geselecteerde sensor
        //is mischien nog nuttig voor als er gefilterd moet worden op id 

        const latestEntriesMap = new Map();// map voor laatste data entry van elke soort

        data.forEach(entry => {//gwn laatste data entry vinden
            const currentLatest = latestEntriesMap.get(entry.type);
            if (!currentLatest || new Date(entry.timestamp) > new Date(currentLatest.timestamp)) {
                latestEntriesMap.set(entry.type, entry);
            }
        });

        /*latestEntriesMap.forEach(entry => { // in console om te zien of et wel juist is, opnieuw alleen de laatste
            var test = `Type: ${entry.type}, Value: ${entry.value}, Timestamp: ${entry.timestamp}`;
            console.log(test); 
        }); */
        //misschien handig voor bugfixing

        latestEntriesMap.forEach(entry => {//steekt alle data in apparte variabele, default values overschrijven
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
    .catch(error => console.error("Error fetching data:", error));//als er iets fout is gegaan bij het ophalen van data natuurlijk
}

class ContainerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });//hierna word data+voorzetsel+figuur meegegeven
        this.shadowRoot.innerHTML = /*html*/`
            <style>
            h1 {
                text-align: center;
                font-size: 3em;
            }
        </style>    
        <h1>Sensor x tabel</h1>
            <div>
                <ul-component title="Plant" item-array='["Luchtvochtigheid:","Bodemvochtigheid:"," Zoutgehalte:"," Lichtintensiteit:"," Hoogte:"," Druk:"," Temperatuur:"]'
                                            data-array='["${humidity}%"," ${soil}%"," ${salt}", "${light_intensity}lux","${altitude}m","${pressure}hPa","${temperature}°C"]'>
                    <!--
                    <img src="/img/pressure.png" alt="Image"> is juist
                    <img src="../img/humidity.png" alt="Image"> maar betekent natuurlijk niet dat dit deftig werkt
                    <img src="../img/height.png" alt="Image">
                    <img src="../img/light.png" alt="Image">                
                    <img src="../img/termometer.png" alt="Image">
                    -->
                </ul-component>

                <ul-component title="Sensor" item-array='[" Batterij:"]' data-array='["${batterij}%"]'>
                </ul-component>
            </div>
        `;
    }
    
    connectedCallback(){
        const currentSensor = getCurrentSensorId(); //vraag de huidige sensorid
        this.shadowRoot.querySelector('h1').innerHTML = `Sensor ${currentSensor} tabel`; //huidige sensor aangeven in h1
    }
}

customElements.define('container-component', ContainerComponent);

// dataItem.js
//de dataitems zelf
class LiComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
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
//de lijst waarin de data items worden gezet
class UlComponent extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title');
        const dataArray = JSON.parse(this.getAttribute('data-array')) || [];
        const itemArray = JSON.parse(this.getAttribute('item-array')) || [];

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                h1 {
                    text-align: center;
                }
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
                    width: 10.5em;
                    box-sizing: border-box;
                } 
                strong {
                color: #2E7D32;        
                }
            </style>
            <div class="flex-container">
                <div class="flex-title-child">
                    <h1>${title + ":"}</h1>
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
