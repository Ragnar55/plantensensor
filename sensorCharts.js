function filterDataByType(mockData, sensorType) {
    return mockData.filter(data => data.type === sensorType);
};

function filterDataById(mockData, sensorId) {
    return mockData.filter(data => data.sensorId === sensorId);
};

function filterDataByTypeAndId (mockData, sensorType, sensorId) {
    return mockData.filter(data => data.type == sensorType && data.sensorId == sensorId);
};

function extractValues(sensorDataArray) {
    return sensorDataArray.map(entry => entry.value);
}

function extractTimestamps(sensorDataArray) {
    return sensorDataArray.map(entry => entry.timestamp);
}

function getSensorTypes(mockData) {
    const uniqueTypes = new Set();
    mockData.forEach(data => {
        uniqueTypes.add(data.type);
    });
    return Array.from(uniqueTypes);
};

function getSensorIds(mockData) {
    const uniqueIds = new Set();
    mockData.forEach(data => {
        uniqueIds.add(data.sensorId);
    });
    return Array.from(uniqueIds);
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
            border: solid yellow;
        }
    </style>
    <h1>sensor x charts</h1>
    <div id="chartsContainer"></div>
`;

class chartComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.append(chartTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this.mockSensorData = [];
        this.uniqueSensorIds = [];
        this.uniqueSensorTypes = [];
        this.chartsContainer = this.shadowRoot.getElementById('chartsContainer');
        this.apiRequest();
    }

    async apiRequest() {
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
            this.updateChart(this.uniqueSensorIds[0]);
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