function getSensorIds(sensorData) {
    const uniqueIds = new Set();
    sensorData.forEach(data => {
        uniqueIds.add(data.sensorId);
    });
    return Array.from(uniqueIds);
}

const homeTemplate = document.createElement("template")
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
    <div id="sensors"></div>
`

class homeComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"}) 
        this.shadow.append(homeTemplate.content.cloneNode(true))
        this.sensorData = [];
        this.uniqueSensorIds = [];
        this.homeComponentAdded = false;
    }

    laadData(){
        fetch("http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors")// haalt alles op
        .then(response => response.json())
        .then(data => {
            this.sensorData = data instanceof Array ? data : [data];
            this.uniqueSensorIds = getSensorIds(this.sensorData);

            console.log("home sensor ids", this.uniqueSensorIds);
            
            this.addSensors();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }

    addSensors(){
        const sensors = this.shadow.getElementById("sensors");
        sensors.innerHTML = "";

        this.uniqueSensorIds.forEach(sensorId => {
            const h2 = document.createElement("h2")
            h2.textContent = `sensor ${sensorId}:`;
            sensors.appendChild(h2);

            const battery = document.createElement("div");
            battery.id = `battery-${sensorId}`;
            sensors.appendChild(battery);

            this.displayBattery(sensorId);
        });
    }

    displayBattery(sensorId){
        const batteryDiv = this.shadow.getElementById(`battery-${sensorId}`);
        batteryDiv.innerHTML = "";

        fetch(`http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetLatestDataByType?sensorId=${sensorId}&type=battery`)
            .then(response => response.json())
            .then(data => {
                const batteryValue = data?.value || "N/A";
                const batteryText = document.createElement("p");
                batteryText.textContent = `Battery: ${batteryValue}%`;
                batteryDiv.appendChild(batteryText);
            })
            .catch(error => {
                console.error(`Error fetching battery data for Sensor ${sensorId}:`, error);
            });
    }

    connectedCallback()
    {        
        console.log("home connected callback called");
        console.trace();
        if (!this.homeComponentAdded) {
            this.homeComponentAdded = true;
            this.laadData();
        }
    }
}

customElements.define('home-comp', homeComponent)