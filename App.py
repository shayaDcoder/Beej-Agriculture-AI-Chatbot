from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_query = data.get('query')

    if not user_query:
        return jsonify({'response': "Please provide a question or prompt."}), 400

    try:
       
        response = model.generate_content(user_query)
        if response.text:
            return jsonify({'response': response.text}), 200
        else:
            return jsonify({'response': "Sorry, I couldn't find an answer to that question."}), 404

    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({'response': "Error fetching data. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True)