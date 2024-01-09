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
    <div id="chartsContainer"></div>
`;

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
            const chartsContainer = this.$el.querySelector('#chartsContainer');
            chartsContainer.innerHTML = '';

            if (this.uniqueSensorTypes.length === 0) {
                chartsContainer.innerHTML = '<p>No sensordata found to display</p>';
            }

            for (const id of this.uniqueSensorIds) {
                for (const type of this.uniqueSensorTypes) {
                    const filteredData = filterDataByTypeAndId(this.mockSensorData, type, id);
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
                    this.mockSensorData = data instanceof Array ? data : [data];
                    this.uniqueSensorIds = getSensorIds(this.mockSensorData);
                    this.uniqueSensorTypes = getSensorTypes(this.mockSensorData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
    },
    mounted() {
        this.apiRequest();
    },
});