const chartTemplate = document.createElement("template");
chartTemplate.innerHTML = /*html*/`
    <style>
        h1 {
            color: blue;
        }
        #chartsContainer {
            display: flex;
            flex-wrap: wrap;
        }
        canvas {
            margin: 20px;
            box-sizing: border-box;
            height: 300px;
            width: 600px;
        }
    </style>
    <h1>hello i am the charts page</h1>
    <div id="chartsContainer">
        <canvas id="chart-0" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
        <canvas id="chart-1" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
        <canvas id="chart-2" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
        <canvas id="chart-3" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
        <canvas id="chart-4" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
        <canvas id="chart-5" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
        <canvas id="chart-6" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
        <canvas id="chart-7" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    </div>
`;

class chartComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"}) 
        this.shadow.append(chartTemplate.content.cloneNode(true))
        
    }
}

Vue.component('chart-comp', {
    template: '#chart-comp-template',
    props: {
        mockSensorData: Array,
        uniqueSensorIds: Array,
        uniqueSensorTypes: Array,
    },
    watch: {
        mockSensorData: 'updateCharts',
        uniqueSensorIds: 'updateCharts',
        uniqueSensorTypes: 'updateCharts',
    },
    mounted() {
        this.updateCharts();
    },
    methods: {
        updateCharts() {
            const chartsContainer = this.$el.querySelector('#chartscontainer');
            //chartsContainer.innerHTML = '';

            if (this.uniqueSensorTypes.length === 0) {
                chartsContainer.innerHTML = '<p>No sensordata found to display</p>';
            }

            for (const id of this.uniqueSensorIds) {
                for (const type of this.uniqueSensorTypes) {
                    const filteredData = this.filterDataByTypeAndId(this.mockSensorData, type, id);
                    if (filteredData.length === 0) continue;
                    const dataToShow = extractValues(filteredData);
                    const labelsToShow = extractTimestamps(filteredData);
                    this.generateChart(chartsContainer, dataToShow, labelsToShow, id + '-' + type);
                }
            }
        },
        generateChart(chartsContainer, dataToShow, labelsToShow, id) {
            const canvas = document.createElement('canvas');
            canvas.id = 'chart-' + id;
            canvas.style.margin = '20px';
            canvas.style.display = 'block';
            canvas.style.boxSizing = 'border-box';
            canvas.width = 600;
            canvas.height = 300;
            chartsContainer.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labelsToShow,
                    datasets: [{
                        label: id,
                        data: dataToShow,
                        borderWidth: 1,
                        borderColor: '#0041C2',
                    }]
                },
            });
        }
    }
});

new Vue({
    el: '#app',
    data: {
        mockSensorData: [],
        uniqueSensorIds: [],
        uniqueSensorTypes: [],
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
                    console.log('Received data:', data)
                    this.mockSensorData = data instanceof Array ? data : [data];
                    this.uniqueSensorIds = this.getSensorIds(this.mockSensorData);
                    this.uniqueSensorTypes = this.getSensorTypes(this.mockSensorData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        filterDataByType(mockData, sensorType) {
            return mockData.filter(data => data.type === sensorType);
        },
        
        filterDataById(mockData, sensorId) {
            return mockData.filter(data => data.sensorId === sensorId);
        },

        getSensorIds(mockData) {
            const uniqueIds = new Set();
            mockData.forEach(data => {
                uniqueIds.add(data.sensorId);
            });
            return Array.from(uniqueIds);        
        },
        
        getSensorTypes(mockData) {
            const uniqueTypes = new Set();
            mockData.forEach(data => {
                uniqueTypes.add(data.type);
            });
            return Array.from(uniqueTypes);        
        },
        
        filterDataByTypeAndId(mockData, sensorType, sensorId) {
            return mockData.filter(data => data.type == sensorType && data.sensorId == sensorId);
        },
        
        extractValues(sensorDataArray) {
            return sensorDataArray.map(entry => entry.value);
        },
        
        extractTimestamps(sensorDataArray) {
            return sensorDataArray.map(entry => entry.timestamp);
        },
    },
    mounted() {
        this.apiRequest();
    },
});

customElements.define('chart-comp', chartComponent)