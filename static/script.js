// STDAMS Dashboard Frontend Logic
// Enhanced for smooth, animated, real-time Chart.js charts with gradients, tension, tooltips, and gauge

let telemetryHistory = [];
let threatCounts = { 'Low Risk': 0, 'Medium Risk': 0, 'High Risk': 0 };
let riskScore = 0;

// Chart.js context
const telemetryChartCtx = document.getElementById('telemetryChart').getContext('2d');
const threatPieCtx = document.getElementById('threatPie').getContext('2d');
const riskGaugeCtx = document.getElementById('riskGauge').getContext('2d');

// Gradient helpers
function createLineGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Telemetry Line Chart
const telemetryChart = new Chart(telemetryChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [],
                borderColor: createLineGradient(telemetryChartCtx, '#00ffe7', '#0055ff'),
                backgroundColor: 'rgba(0,255,231,0.08)',
                fill: true,
                tension: 0.45,
                pointRadius: 2,
                borderWidth: 3
            },
            {
                label: 'Battery (%)',
                data: [],
                borderColor: createLineGradient(telemetryChartCtx, '#00ff99', '#005533'),
                backgroundColor: 'rgba(0,255,153,0.08)',
                fill: true,
                tension: 0.45,
                pointRadius: 2,
                borderWidth: 3
            },
            {
                label: 'Signal (%)',
                data: [],
                borderColor: createLineGradient(telemetryChartCtx, '#ffe600', '#ff9900'),
                backgroundColor: 'rgba(255,230,0,0.08)',
                fill: true,
                tension: 0.45,
                pointRadius: 2,
                borderWidth: 3
            },
            {
                label: 'CPU (%)',
                data: [],
                borderColor: createLineGradient(telemetryChartCtx, '#ff3c00', '#ff0055'),
                backgroundColor: 'rgba(255,60,0,0.08)',
                fill: true,
                tension: 0.45,
                pointRadius: 2,
                borderWidth: 3
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 900,
            easing: 'easeInOutCubic'
        },
        plugins: {
            legend: { labels: { color: '#e0e0e0', font: { size: 14 } } },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#23272f',
                titleColor: '#00ffe7',
                bodyColor: '#e0e0e0',
                borderColor: '#00ffe7',
                borderWidth: 1
            }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
            x: {
                ticks: { color: '#e0e0e0' },
                grid: { color: 'rgba(0,255,231,0.08)' }
            },
            y: {
                ticks: { color: '#e0e0e0' },
                grid: { color: 'rgba(0,255,231,0.08)' }
            }
        }
    }
});

// Threat Pie Chart
const threatPie = new Chart(threatPieCtx, {
    type: 'pie',
    data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
                createLineGradient(threatPieCtx, '#00ff99', '#005533'),
                createLineGradient(threatPieCtx, '#ffe600', '#ff9900'),
                createLineGradient(threatPieCtx, '#ff3c00', '#ff0055')
            ],
            borderWidth: 2,
            borderColor: '#23272f'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#e0e0e0', font: { size: 14 } } },
            tooltip: {
                enabled: true,
                backgroundColor: '#23272f',
                titleColor: '#00ffe7',
                bodyColor: '#e0e0e0',
                borderColor: '#00ffe7',
                borderWidth: 1
            }
        }
    }
});

// Risk Gauge Chart (using Chart.js 'doughnut' as gauge)
let riskGauge;
function updateRiskGauge(score) {
    if (!riskGauge) {
        riskGauge = new Chart(riskGaugeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Risk', 'Safe'],
                datasets: [{
                    data: [score, 100 - score],
                    backgroundColor: [
                        createLineGradient(riskGaugeCtx, '#ff3c00', '#ffe600'),
                        '#23272f'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                rotation: -90,
                circumference: 180,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#23272f',
                        titleColor: '#00ffe7',
                        bodyColor: '#e0e0e0',
                        borderColor: '#00ffe7',
                        borderWidth: 1
                    },
                    title: {
                        display: true,
                        text: 'Risk Score',
                        color: '#00ffe7',
                        font: { size: 16 }
                    }
                }
            }
        });
    } else {
        riskGauge.data.datasets[0].data = [score, 100 - score];
        riskGauge.update();
    }
}

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
        updateRiskGauge(10);
        return;
    }
    indicator.textContent = alert.risk;
    indicator.className = alert.risk === 'High Risk' ? 'risk-high' : alert.risk === 'Medium Risk' ? 'risk-medium' : 'risk-low';
    updateRiskGauge(alert.risk_score || 10);
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
    telemetryChart.update('active');

    threatPie.data.datasets[0].data = [threatCounts['Low Risk'], threatCounts['Medium Risk'], threatCounts['High Risk']];
    threatPie.update('active');
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

setInterval(fetchTelemetry, 2000);
setInterval(fetchAlerts, 3000);
