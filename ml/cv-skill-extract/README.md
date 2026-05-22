# CV Skill Extraction API

This project is a Flask-based web application that allows you to upload resumes (in PDF or DOCX format), extract the text, and identify the skills listed in the resume using the Gemini API. The extracted skills are returned as a comma-separated list.

Additionally, LangChain is integrated into this project to enhance the text processing capabilities, allowing for more advanced natural language processing and skill extraction from resumes.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Python 3.x
- pip (Python package installer)


You will also need an API key for the Gemini API. You can obtain it by signing up for the Gemini service and generating an API key.

## Project Setup

Follow the steps below to set up the project:

### 1. Install Required Packages

Navigate to the `cv-skill-extract` directory within the `cd/ml` folder:

```bash
cd ml/cv-skill-extract
```

Next, install the necessary Python packages by running the following command:

```bash
pip install flask flask-cors python-dotenv PyPDF2 python-docx requests langchain openai gunicorn
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

### 3. Configure Environment Variables

Create a .env file in the root directory of the project and add the following:

```bash
GEMINI_API_KEY=<your_gemini_api_key>
```
Replace <your_gemini_api_key> with your actual Gemini API key.

### 4. Running the Flask App

Once the setup is complete, you can start the Flask application by running the following command:

```bash
python app.py
```

This will start the server, and you can access the cv skill extract backend through the API endpoints.
