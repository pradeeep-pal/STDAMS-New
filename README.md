# STDAMS - Satellite Threat Detection and Monitoring System

STDAMS is a Flask-based AI project that simulates satellite telemetry, detects anomalies using Isolation Forest, classifies threats, and provides a real-time cyber-security dashboard.

## Features
- Simulates telemetry: temperature, battery, signal, CPU
- AI anomaly detection (Isolation Forest)
- Threat classification (Low/Medium/High Risk)
- Real-time alerts and risk scoring
- Modern dashboard with Chart.js, dark theme

## Project Structure
- `app.py`: Main Flask app
- `simulator.py`: Telemetry data simulation
- `model.py`: AI anomaly detection
- `threat_engine.py`: Threat classification
- `alerts.py`: Alert management
- `data/telemetry_log.csv`: (Optional) Telemetry log
- `templates/dashboard.html`: Dashboard UI
- `static/style.css`: Dashboard styles
- `static/script.js`: Dashboard logic

## Run the App
1. Install requirements: `pip install -r requirements.txt`
2. Run: `python app.py`
3. Open [http://localhost:5000](http://localhost:5000)
