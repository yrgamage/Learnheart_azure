import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import PyPDF2
import docx
from flask_cors import CORS
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"


if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            return ''.join(page.extract_text() or '' for page in reader.pages)
    except Exception as e:
        raise RuntimeError(f"Error extracting text from PDF: {str(e)}")


def extract_text_from_docx(docx_path):
    try:
        doc = docx.Document(docx_path)
        return '\n'.join(para.text for para in doc.paragraphs)
    except Exception as e:
        raise RuntimeError(f"Error extracting text from DOCX: {str(e)}")


def extract_skills(text):
    prompt = f"""
        Given the following resume text, extract only the skills mentioned.
        Return the skills as a comma-separated list.

        Resume Text:
        {text}
    """
    
    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
        json=data,
        headers=headers
    )

    if response.status_code == 200:
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text'].split(', ')
    else:
        raise RuntimeError("Error extracting skills with Gemini API")


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'cv' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['cv']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        # Extract text from the file
        if filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(filepath)
        elif filename.endswith('.docx'):
            resume_text = extract_text_from_docx(filepath)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        # Extract skills from the text
        skills = extract_skills(resume_text)
        return jsonify({"skills": skills})

    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)