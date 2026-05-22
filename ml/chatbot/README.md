# Chatbot Setup with Python Flask

This contains the backend for the Chatbot project, built using Python and Flask. It provides a set of APIs that are connected to the frontend and are responsible for handling chatbot-related queries and responses.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Python 3.x
- pip (Python package installer)

## Project Setup

Follow the steps below to set up the project:

### 1. Install Required Packages

Navigate to the `chatbot` directory within the `cd/ml` folder:

```bash
cd ml/chatbot
```

Next, install the necessary Python packages by running the following command:

```bash
pip install flask flask-cors gunicorn
```

Alternatively, you can install all dependencies at once using the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

### 2. Generate `requirements.txt`

To ensure the environment is reproducible and that all dependencies are locked, generate a `requirements.txt` file by running:

```bash
pip freeze > requirements.txt
```

This file will include all the Python packages that the project depends on.

### 3. Running the Flask App

Once the setup is complete, you can start the Flask application by running the following command:

```bash
python app.py
```

This will start the server, and you can access the chatbot backend through the API endpoints.

