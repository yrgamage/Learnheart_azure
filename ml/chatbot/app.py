from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from difflib import get_close_matches

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

DATA_SOURCE_File = "data_source.json"

def load_data_source():
    with open(DATA_SOURCE_File, "r") as file:
        return json.load(file)

def save_data_source(data):
    with open(DATA_SOURCE_File, "w") as file:
        json.dump(data, file, indent=2)

def find_best_match(user_question, questions):
    matches = get_close_matches(user_question, questions, n=1, cutoff=0.6)
    return matches[0] if matches else None

def get_answer_for_question(question, data_source):
    for q in data_source["questions"]:
        if q["question"] == question:
            return q["answer"]
    return None

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_question = data.get("question", "")

    data_source = load_data_source()
    questions_list = [q["question"] for q in data_source["questions"]]

    best_match = find_best_match(user_question, questions_list)

    if best_match:
        answer = get_answer_for_question(best_match, data_source)
        return jsonify({"response": answer, "learn": False})
    
    return jsonify({"response": "I don't know the answer. Can you teach me?", "learn": True})

@app.route("/learn", methods=["POST"])
def learn():
    data = request.json
    question = data.get("question", "")
    answer = data.get("answer", "")

    data_source = load_data_source()
    data_source["questions"].append({"question": question, "answer": answer})
    save_data_source(data_source)

    return jsonify({"message": "Thank you! I learned a new response."})

if __name__ == "__main__":
    app.run(debug=True)
