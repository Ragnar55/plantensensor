const chartTemplate = document.createElement("template")
chartTemplate.innerHTML = /*html*/`
    <style>
        h1{
            color: blue;
        }
    </style>
    <h1>hello i am the charts page</h1>
    <canvas id="chart-0" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    <canvas id="chart-1" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    <canvas id="chart-2" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    <canvas id="chart-3" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    <canvas id="chart-4" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    <canvas id="chart-5" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    <canvas id="chart-6" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
    <canvas id="chart-7" style="margin: 20px; display: block; box-sizing: border-box; height: 300px; width: 600px;" width="600" height="300"></canvas>
`

class chartComponent extends HTMLElement
{
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: "open"}) 
        this.shadow.append(chartTemplate.content.cloneNode(true))
        
    }
}

customElements.define('chart-comp', chartComponent)