# Violence & Weapon Detection System

An AI-powered surveillance system that detects weapons and violent activity 
in uploaded videos using YOLOv8 deep learning models.

## What It Does

- Detects weapons (guns, knives) in uploaded video footage
- Detects violent activity and physical altercations in uploaded video footage
- Displays real-time bounding boxes, confidence scores, threat levels and alerts
- Professional dashboard UI with incident logs and detection stats

## Tech Stack

- **Frontend** — React
- **Backend Gateway** — FastAPI
- **Model Services** — Flask (x2)
- **AI Models** — YOLOv8 (PyTorch + Keras)
- **Video Processing** — OpenCV
- **Deep Learning** — Ultralytics, TensorFlow

## Architecture

React Frontend → FastAPI Gateway → Flask Weapon Service (port 5001)
                                 → Flask Violence Service (port 5002)

## How To Run

### 1. Clone the repository
git clone https://github.com/yourusername/violence-weapon-detection-system.git

### 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

### 3. Install dependencies
pip install -r requirements.txt

### 4. Add model files
Place your model files in their respective folders:
- backend/weapon_service/Weapon_best.pt
- backend/violence_service/Violence_Detection_best_model.keras

### 5. Run all services

Terminal 1 - Weapon Detection Service
cd backend/weapon_service
python app.py

Terminal 2 - Violence Detection Service
cd backend/violence_service
python app.py

Terminal 3 - FastAPI Gateway
cd backend
uvicorn main:app --reload --port 8000

Terminal 4 - React Frontend
cd frontend
npm install
npm start

### 6. Open browser
Go to http://localhost:3000

## How To Use

1. Open the dashboard on your browser
2. Go to Weapon Detection or Fight Detection page
3. Click Start Monitoring
4. Upload a video file
5. Wait for analysis to complete
6. View real detections, threat level and alerts on the dashboard

## Project Structure

project/
├── frontend/          React dashboard
├── backend/
│   ├── main.py        FastAPI gateway
│   ├── weapon_service/
│   │   └── app.py     Weapon detection Flask service
│   └── violence_service/
│       └── app.py     Violence detection Flask service
└── requirements.txt

## Note

Model files (.pt and .keras) are not included in this repository 
due to file size limitations.
