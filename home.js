//#region IMPORTS
import "./sensor.js";//moet die laaddata doen toch niet maar wel webcomponenten stelen
//#endregion IMPORTS

function laadDataAlleenBaterij() {
    // haalt data op en steekt de id en batterij in console
    fetch('http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors')
        .then(response => response.json())
        .then(data => {
            const latestBatteryMap = new Map();
            const sensorIds = []; // Array to store sensor IDs
            const batteryData = []; // Array to store battery data

            data.forEach(entry => {
                // laatste batterij data per id halen
                if (entry.type === 'battery') {
                    const currentLatest = latestBatteryMap.get(entry.sensorId);
                    if (!currentLatest || new Date(entry.timestamp) > new Date(currentLatest.timestamp)) {
                        latestBatteryMap.set(entry.sensorId, entry);
                    }
                }
            });

            latestBatteryMap.forEach((latestEntry, sensorId) => {
                console.log(`Sensor ID: ${sensorId}, Latest Battery: ${latestEntry.value}`);
                // Add sensor ID and battery data to arrays
                sensorIds.push(sensorId);
                batteryData.push(latestEntry.value);
            });

            console.log("doe de laat data batterij");

            // Make arrays accessible outside the function
            laadDataAlleenBaterij.sensorIds = sensorIds;
            laadDataAlleenBaterij.batteryData = batteryData;
        })
        .catch(error => console.error('Error fetching data:', error));
}

const homeTemplate = document.createElement("template")//titel moet dan id zijn
homeTemplate.innerHTML = /*html*/`
    <style>
        h1 {
            text-align: center;
            font-size: 3em;
        }
        h2 {
            text-align: center;
            font-size: 2.5em;
        }
    </style>
    <h1>Active sensors:</h1>
    <div id="sensors">
    <ul-component title="" item-array='[" Batterij:"]' data-array='["%"]'>
    </ul-component>
    </div>
`

class homeComponent extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.append(homeTemplate.content.cloneNode(true))
        this.sensorData = [];
        this.uniqueSensorIds = [];
        this.homeComponentAdded = false;
        laadDataAlleenBaterij();
        //getSensorIds(laadData);
        console.log("doe de laat data");
    }


}

customElements.define('home-comp', homeComponent)