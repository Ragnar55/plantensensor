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
            height: 20em;
            align-items: center;
            justify-content: center;
        }
        canvas {
            margin: 20px auto;
            display: block;
            box-sizing: border-box;
            width: 100em;
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
        this.render();
    }

    render() {
        const chartsContainer = this.shadowRoot.getElementById('chartsContainer');
        for (let i = 0; i < 8; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 300;
            canvas.id = `chart-${i}`;
            chartsContainer.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May'],
                    datasets: [{
                        label: `Chart ${i + 1}`,
                        data: [65, 59, 80, 81, 56],
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1
                    }]
                }
            });
        }
    }
}

customElements.define('chart-comp', chartComponent);