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
            font-size: 1em;
        }
        .sensor-info {
            font-size: 2.2em;
            text-align: center;
            margin: 0.5em;
            padding: 0.5em;
            border-radius: 5em;
            background-color: #A4DEDF;
            width: 10em;
        }
        #sensors{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
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
            sensorInfo.textContent = `Sensor ${sensorId}`;
            sensorsDiv.appendChild(sensorInfo);

            const batterijInfo = document.createElement("h2");
            batterijInfo.textContent = `Battery: ${batteryData[index]}%`;
            sensorInfo.appendChild(batterijInfo);
        });
    }
}

customElements.define('home-comp', homeComponent);
