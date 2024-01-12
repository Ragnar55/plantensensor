function getSensorTypes(sensorData) {           //haalt de datatypes (soil,humidity,...)
    const uniqueTypes = new Set();              //uit de data en zet dit in een set
    sensorData.forEach(data => {
        uniqueTypes.add(data.type);
    });
    return Array.from(uniqueTypes);
};

function filterDataByTypeAndId (sensorData, sensorType, sensorId) {
    return sensorData.filter(data => data.type == sensorType && data.sensorId == sensorId);
};

function extractValues(sensorDataArray) {               //haalt de values uit de data en zet ze in een map
    return sensorDataArray.map(entry => entry.value);   
};

function extractFormattedDates(sensorDataArray) {       //haalt de tijd uit de data en zet deze om
    return sensorDataArray.map(entry => {               //zet dit in een map
        const timestamp = new Date(entry.timestamp);
        return timestamp.toLocaleDateString();
    });
};

function getSensorIds(sensorData) {         //haalt sensorIds uit data
    const uniqueIds = new Set();            //& zet deze in set
    sensorData.forEach(data => {
        uniqueIds.add(data.sensorId);
    });
    return Array.from(uniqueIds);
};

function getCurrentSensorId(){              //huidige sensorId
    return sessionStorage.getItem('currentSensorId');
};

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
        //console.log(currentSensor);

        this.sensorData = [];           //array van de ontvangendata
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
            this.sensorData = data instanceof Array ? data : [data];        //ontvangen data in array gezet

            this.uniqueSensorIds = getSensorIds(this.sensorData);           //Array met sensorIds

            this.uniqueSensorTypes = getSensorTypes(this.sensorData);       //zelfde met types
            this.updateChart(sensorId);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    updateChart(sensorId) {
        this.chartsContainer.innerHTML = '';    //cleart de container bij elke update

        for (const type in this.uniqueSensorTypes) {        //gaat over elke type en maakt hier een chart van
            const filteredData = filterDataByTypeAndId(this.sensorData, this.uniqueSensorTypes[type], sensorId);
            if(filteredData.length === 0) continue;         //als er geen filteredData is, wordt de rest geskipt
            const showData = extractValues(filteredData);
            const showLabels = extractFormattedDates(filteredData);
            this.generateChart(this.chartsContainer, showData, showLabels, type);               
        }
    }

    generateChart(chartsContainer, showData, showLabels, type) {
        //canvas aanmaken en toevoegen aan chartscontainer
        const canvas = document.createElement('canvas');
        canvas.style.margin = '20px';
        canvas.id = `chart-${type}`;
        chartsContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: showLabels,
                datasets: [{
                    label: this.uniqueSensorTypes[type],
                    data: showData,
                    borderWidth: 1,
                    borderColor: 'black',
                }]
            },
        });
    }
}

customElements.define('chart-comp', chartComponent);