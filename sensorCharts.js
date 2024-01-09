const chartTemplate = document.createElement("template")
chartTemplate.innerHTML = /*html*/`
    <style>
        h1{
            color: blue;
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
`

class chartComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"}) 
        this.shadow.append(chartTemplate.content.cloneNode(true))
        
    }
}

new Vue({
    el: '#app',
    data: {
        //mockSensorData: dataArray,
        //uniqueSensorIds: getSensorIds(dataArray),
        //uniqueSensorTypes: getSensorTypes(dataArray),
        mockSensorData: [],
        uniqueSensorIds: [],
        uniqueSensorTypes: [],
    },
    mounted() {
        this.apiRequest();
        //this.updateChart(this.uniqueSensorIds[0]);
    },
    methods: {
        //delete when using mockdata
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
        getSensorTypes(mockData) {
            const uniqueTypes = new Set();
            mockData.forEach(data => {
                uniqueTypes.add(data.type);
            });
            return Array.from(uniqueTypes);
        },
        
        getSensorIds(mockData) {
            const uniqueIds = new Set();
            mockData.forEach(data => {
                uniqueIds.add(data.sensorId);
            });
            return Array.from(uniqueIds);
        },

        updateChart(sensorId) {
            const chartsContainer = document.getElementById('chartsContainer');
            chartsContainer.innerHTML = '';

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


customElements.define('chart-comp', chartComponent)