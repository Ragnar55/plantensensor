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

Vue.component('chart-comp', {
    template: '#chart-template',
    data: {
        mockSensorData: [],
        uniqueSensorIds: [],
        uniqueSensorTypes: [],
    },
    mounted() {
        this.apiRequest();
    },
    methods: {
        apiRequest() {
            const url = 'http://plantensensor.northeurope.cloudapp.azure.com:11000/api/GetAllSensorDataFromAllSensors';
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.mockSensorData = data instanceof Array ? data : [data];
                    this.uniqueSensorIds = getSensorIds(this.mockSensorData);
                    this.uniqueSensorTypes = getSensorTypes(this.mockSensorData);
                    this.updateChart(this.uniqueSensorIds[0]);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        updateChart(sensorId) {
            const chartsContainer = this.chartsContainer;
            this.chartsContainer.innerHTML = '';

            if (this.uniqueSensorTypes.length === 0) {
                chartsContainer.innerHTML = '<p>No sensordata found to display</p>';
            }

            for (const type in this.uniqueSensorTypes) {
                const filteredData = filterDataByTypeAndId(this.mockSensorData, this.uniqueSensorTypes[type], sensorId);
                if(filteredData.length === 0) continue;
                const dataToShow = extractValues(filteredData);
                const labelsToShow = extractTimestamps(filteredData);
                this.generateChart(chartsContainer, dataToShow, labelsToShow, type);               
            }
        },
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
});