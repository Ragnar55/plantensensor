//#region IMPORTS
import "./sensor.js";//moet die laaddata doen toch niet maar wel webcomponenten stelen
//#endregion IMPORTS

function laadDataAlleenBaterij(callback) {
    // haalt data op en steekt de id en batterij in console
    fetch('http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors')
        .then(response => response.json())
        .then(data => {
            const latestBatteryMap = new Map();
            const sensorIds = [];
            const batteryData = [];

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
                //console.log(`Sensor ID: ${sensorId}, Latest Battery: ${latestEntry.value}`);
                sensorIds.push(sensorId);
                batteryData.push(latestEntry.value);
            });

            console.log("doe de laat data batterij");

            laadDataAlleenBaterij.sensorIds = sensorIds;
            laadDataAlleenBaterij.batteryData = batteryData;

            // Call the callback function and pass the arrays
            if (typeof callback === 'function') {
                callback(sensorIds, batteryData);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

const homeTemplate = document.createElement("template");//titel moet dan id zijn
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
        .sensor-info {
            text-align: center;
            margin: 10px;
            padding: 10px;
            border: 1px solid #ccc;
        }
    </style>
    <h1>Active sensors:</h1>
    <div id="sensors">
        
    </div>
`;

class homeComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.append(homeTemplate.content.cloneNode(true));

        // Pass a callback function to laadDataAlleenBaterij
        laadDataAlleenBaterij((sensorIds, batteryData) => {
            this.displaySensorInfo(sensorIds, batteryData);
        });

        console.log("doe de laat data");
    }

    displaySensorInfo(sensorIds, batteryData) {
        const sensorsDiv = this.shadow.getElementById("sensors");

        sensorIds.forEach((sensorId, index) => {
            const sensorInfo = document.createElement("div");
            sensorInfo.classList.add("sensor-info");
            sensorInfo.textContent = `Sensor ID: ${sensorId}, Latest Battery: ${batteryData[index]}`;
            sensorsDiv.appendChild(sensorInfo);
        });
    }
}

customElements.define('home-comp', homeComponent);
