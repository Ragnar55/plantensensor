function filterDataByType(sensorData, sensorType) {
    return sensorData.filter(data => data.type === sensorType);
};

function filterDataById(sensorData, sensorId) {
    return sensorData.filter(data => data.sensorId === sensorId);
};

function filterDataByTypeAndId (sensorData, sensorType, sensorId) {
    return sensorData.filter(data => data.type == sensorType && data.sensorId == sensorId);
};

function extractValues(sensorDataArray) {
    return sensorDataArray.map(entry => entry.value);
}

function extractTimestamps(sensorDataArray) {
    return sensorDataArray.map(entry => entry.timestamp);
}

function getSensorTypes(sensorData) {
    const uniqueTypes = new Set();
    sensorData.forEach(data => {
        uniqueTypes.add(data.type);
    });
    return Array.from(uniqueTypes);
};

function getSensorIds(sensorData) {
    const uniqueIds = new Set();
    sensorData.forEach(data => {
        uniqueIds.add(data.sensorId);
    });
    return Array.from(uniqueIds);
}
function getCurrentSensorId(){
    return sessionStorage.getItem('currentSensorId');
}

const chartTemplate = document.createElement("template");
chartTemplate.innerHTML = /*html*/`
    <style>
        h1 {
            text-align: center;
            font-size: 3em;
        }
        #chartsContainer {
            display: flex;
            flex-wrap: wrap;
            height: 18em;
            align-items: center;
            justify-content: center;
        }
        canvas {
            display: block;
            box-sizing: border-box;
        }
    </style>
    <h1>sensor x grafieken</h1>
    <div id="chartsContainer"></div>
`;

class chartComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.append(chartTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        const currentSensor = getCurrentSensorId(); //vraag de huidige sensorid
        this.shadowRoot.querySelector('h1').innerHTML = `Sensor ${currentSensor} grafieken`; //huidige sensor aangeven in h1
        console.log(currentSensor);

        this.mockSensorData = [];
        this.uniqueSensorIds = [];
        this.uniqueSensorTypes = [];
        this.chartsContainer = this.shadowRoot.getElementById('chartsContainer');
        this.apiRequest(currentSensor);
    }

    async apiRequest(sensorId) {
        try {
            const url = 'http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.mockSensorData = data instanceof Array ? data : [data];
            this.uniqueSensorIds = getSensorIds(this.mockSensorData);

            this.uniqueSensorTypes = getSensorTypes(this.mockSensorData);
            this.updateChart(sensorId);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    updateChart(sensorId) {
        this.chartsContainer.innerHTML = '';

        if (this.uniqueSensorTypes.length === 0) {
            this.chartsContainer.innerHTML = '<p>No sensordata found to display</p>';
        }

        for (const type in this.uniqueSensorTypes) {
            const filteredData = filterDataByTypeAndId(this.mockSensorData, this.uniqueSensorTypes[type], sensorId);
            if(filteredData.length === 0) continue;
            const dataToShow = extractValues(filteredData);
            const labelsToShow = extractTimestamps(filteredData);
            this.generateChart(this.chartsContainer, dataToShow, labelsToShow, type);               
        }
    }

    generateChart(chartsContainer, dataToShow, labelsToShow, type) {
        const canvas = document.createElement('canvas');
        canvas.style.margin = '20px';
        canvas.id = `chart-${type}`;
        chartsContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsToShow,
                datasets: [{
                    label: this.uniqueSensorTypes[type],
                    data: dataToShow,
                    borderWidth: 1,
                    borderColor: '#0041C2',
                }]
            },
        });
    }
}

customElements.define('chart-comp', chartComponent);