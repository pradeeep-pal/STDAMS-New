// STDAMS Dashboard Frontend Logic
// Fetches telemetry and alerts, updates UI and charts in real time

let telemetryHistory = [];
let threatCounts = { 'Low Risk': 0, 'Medium Risk': 0, 'High Risk': 0 };

const telemetryChartCtx = document.getElementById('telemetryChart').getContext('2d');
const threatPieCtx = document.getElementById('threatPie').getContext('2d');

const telemetryChart = new Chart(telemetryChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Temperature (°C)', data: [], borderColor: '#00ffe7', fill: false },
            { label: 'Battery (%)', data: [], borderColor: '#00ff99', fill: false },
            { label: 'Signal (%)', data: [], borderColor: '#ffe600', fill: false },
            { label: 'CPU (%)', data: [], borderColor: '#ff3c00', fill: false }
        ]
    },
    options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#e0e0e0' } } },
        scales: {
            x: { ticks: { color: '#e0e0e0' } },
            y: { ticks: { color: '#e0e0e0' } }
        }
    }
});

const threatPie = new Chart(threatPieCtx, {
    type: 'pie',
    data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#00ff99', '#ffe600', '#ff3c00']
        }]
    },
    options: {
        plugins: { legend: { labels: { color: '#e0e0e0' } } }
    }
});

function updateTelemetryUI(data) {
    document.getElementById('temp').textContent = data.temperature;
    document.getElementById('battery').textContent = data.battery;
    document.getElementById('signal').textContent = data.signal;
    document.getElementById('cpu').textContent = data.cpu;
}

function updateRiskIndicator(alert) {
    const indicator = document.getElementById('risk-indicator');
    if (!alert) {
        indicator.textContent = 'Low';
        indicator.className = 'risk-low';
        return;
    }
    indicator.textContent = alert.risk;
    indicator.className = alert.risk === 'High Risk' ? 'risk-high' : alert.risk === 'Medium Risk' ? 'risk-medium' : 'risk-low';
}

function updateAlertsUI(alerts) {
    const list = document.getElementById('alerts-list');
    list.innerHTML = '';
    alerts.slice().reverse().forEach(alert => {
        const li = document.createElement('li');
        li.className = alert.risk === 'High Risk' ? 'alert-high' : alert.risk === 'Medium Risk' ? 'alert-medium' : 'alert-low';
        li.textContent = `[${alert.timestamp}] ${alert.risk} - Temp: ${alert.telemetry.temperature}°C, Battery: ${alert.telemetry.battery}%, Signal: ${alert.telemetry.signal}%, CPU: ${alert.telemetry.cpu}% (Score: ${alert.risk_score})`;
        list.appendChild(li);
    });
}

function updateCharts() {
    const labels = telemetryHistory.map((_, i) => i + 1);
    telemetryChart.data.labels = labels;
    telemetryChart.data.datasets[0].data = telemetryHistory.map(d => d.temperature);
    telemetryChart.data.datasets[1].data = telemetryHistory.map(d => d.battery);
    telemetryChart.data.datasets[2].data = telemetryHistory.map(d => d.signal);
    telemetryChart.data.datasets[3].data = telemetryHistory.map(d => d.cpu);
    telemetryChart.update();

    threatPie.data.datasets[0].data = [threatCounts['Low Risk'], threatCounts['Medium Risk'], threatCounts['High Risk']];
    threatPie.update();
}

async function fetchTelemetry() {
    const res = await fetch('/api/telemetry');
    const data = await res.json();
    telemetryHistory.push(data);
    if (telemetryHistory.length > 30) telemetryHistory.shift();
    updateTelemetryUI(data);
    updateCharts();
}

async function fetchAlerts() {
    const res = await fetch('/api/alerts');
    const alerts = await res.json();
    updateAlertsUI(alerts);
    if (alerts.length > 0) {
        updateRiskIndicator(alerts[alerts.length - 1]);
        threatCounts = { 'Low Risk': 0, 'Medium Risk': 0, 'High Risk': 0 };
        alerts.forEach(a => threatCounts[a.risk]++);
    } else {
        updateRiskIndicator(null);
    }
    updateCharts();
}

setInterval(fetchTelemetry, 1000);
setInterval(fetchAlerts, 2000);
