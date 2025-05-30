import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import requests

# Load biến môi trường từ .env
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL   = os.getenv("GEMINI_MODEL", "chat-bison-002")
API_URL = f"https://generativelanguage.googleapis.com/v1beta2/models/{MODEL}:generateMessage?key={API_KEY}"

app = Flask(__name__, static_folder="../frontend", static_url_path="/")

@app.route("/")
def index():
    # Phục vụ file index.html từ frontend
    return app.send_static_file("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    payload = {
        "prompt": {
            "messages": [
                {"author": "user", "content": user_message}
            ]
        },
        "temperature": 0.2,
        "candidateCount": 1
    }

    try:
        resp = requests.post(API_URL, json=payload)
        resp.raise_for_status()
        reply = resp.json()["candidates"][0]["content"]
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
