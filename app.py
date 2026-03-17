"""
Main Flask application for STDAMS - Satellite Threat Detection and Monitoring System
Serves the dashboard and provides API endpoints for telemetry and alerts.
"""
from flask import Flask, render_template, jsonify
from simulator import TelemetrySimulator
from model import AnomalyDetector
from threat_engine import classify_threat
from alerts import AlertManager
import threading
import time

app = Flask(__name__)

# Initialize modules
simulator = TelemetrySimulator()
detector = AnomalyDetector()
alert_manager = AlertManager()

# Shared state for live telemetry and alerts
latest_telemetry = {}
latest_alerts = []

# Background thread to simulate telemetry and detect anomalies

def telemetry_loop():
    global latest_telemetry, latest_alerts
    while True:
        data = simulator.generate()
        latest_telemetry.update(data)
        is_anomaly, score = detector.detect([list(data.values())])
        if is_anomaly:
            risk, risk_score = classify_threat(score)
            alert = alert_manager.create_alert(data, risk, risk_score)
            latest_alerts.append(alert)
            if len(latest_alerts) > 50:
                latest_alerts.pop(0)
        time.sleep(1)

# Start background simulation
threading.Thread(target=telemetry_loop, daemon=True).start()


@app.route('/', methods=['GET'])
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/telemetry', methods=['GET'])
def api_telemetry():
    return jsonify(latest_telemetry)

@app.route('/api/alerts', methods=['GET'])
def api_alerts():
    return jsonify(latest_alerts[-10:])

if __name__ == '__main__':
    app.run(debug=True)
