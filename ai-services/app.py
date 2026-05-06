from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("ERROR: GROQ_API_KEY not found in .env file!")
else:
    print(f"SUCCESS: Groq API key loaded")

client = Groq(api_key=GROQ_API_KEY)
# Old model was decommissioned on Groq; allow override via env.
MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


def call_groq(messages, max_tokens=1024):
    response = client.chat.completions.create(
        model=MODEL,
        max_tokens=max_tokens,
        messages=messages
    )
    return response.choices[0].message.content.strip()


def parse_json_response(text):
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


# ── Health Check ─────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": MODEL,
        "provider": "Groq",
        "api_key_loaded": bool(GROQ_API_KEY)
    })


# ── AI Listing Generator ──────────────────────────────────────────
@app.route("/ai/generate-listing", methods=["POST"])
def generate_listing():
    try:
        data = request.get_json(force=True)
        prompt = data.get("prompt", "").strip()

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        print(f"[generate-listing] prompt: {prompt}")

        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant for UniMart, a college student marketplace in India. Always respond with valid JSON only. No extra text, no markdown, no explanation."
            },
            {
                "role": "user",
                "content": f"""Based on this item: "{prompt}"

Return ONLY this JSON with no extra text:
{{
  "title": "product title under 70 characters",
  "description": "2-3 sentences about the item, its condition and why its a good buy",
  "category": "one of: Books, Electronics, Furniture, Clothing, Stationery, Sports, Other",
  "suggestedPrice": 500
}}"""
            }
        ]

        text = call_groq(messages)
        print(f"[generate-listing] raw response: {text}")
        parsed = parse_json_response(text)
        return jsonify(parsed)

    except json.JSONDecodeError as e:
        print(f"[generate-listing] JSON error: {e}")
        return jsonify({"error": "AI returned invalid format, try again"}), 500
    except Exception as e:
        print(f"[generate-listing] error: {e}")
        return jsonify({"error": str(e)}), 500


# ── AI Price Suggester ────────────────────────────────────────────
@app.route("/ai/suggest-price", methods=["POST"])
def suggest_price():
    try:
        data = request.get_json(force=True)
        title = data.get("title", "")
        category = data.get("category", "")
        condition = data.get("condition", "")

        print(f"[suggest-price] {title} | {category} | {condition}")

        messages = [
            {
                "role": "system",
                "content": "You are a pricing expert for a college student marketplace in India. Respond with valid JSON only, no extra text."
            },
            {
                "role": "user",
                "content": f"""Suggest a fair resale price in Indian Rupees for:
- Item: {title}
- Category: {category}
- Condition: {condition}

Return ONLY this JSON:
{{
  "suggestedPrice": 500,
  "minPrice": 300,
  "maxPrice": 700,
  "reasoning": "one sentence explanation"
}}"""
            }
        ]

        text = call_groq(messages, max_tokens=512)
        print(f"[suggest-price] raw response: {text}")
        parsed = parse_json_response(text)
        return jsonify(parsed)

    except json.JSONDecodeError as e:
        print(f"[suggest-price] JSON error: {e}")
        return jsonify({"error": "AI returned invalid format, try again"}), 500
    except Exception as e:
        print(f"[suggest-price] error: {e}")
        return jsonify({"error": str(e)}), 500


# ── AI Chatbot ───────────────────────────────────────────────────
@app.route("/ai/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        product = data.get("product", {})
        messages = data.get("messages", [])

        print(f"[chat] product: {product.get('title')} | messages: {len(messages)}")

        system_prompt = f"""You are a helpful AI assistant for UniMart, a college student marketplace in India.

Product listing details:
- Title: {product.get('title', 'N/A')}
- Price: Rs.{product.get('price', 'N/A')}
- Category: {product.get('category', 'N/A')}
- Condition: {product.get('condition', 'N/A')}
- Description: {product.get('description', 'N/A')}
- Seller: {product.get('sellerName', 'N/A')}
- College: {product.get('sellerCollege', 'N/A')}
- Status: {'SOLD - no longer available' if product.get('isSold') else 'Available for purchase'}

Instructions:
- Answer questions about this listing only
- Be concise, friendly and helpful
- Prices are generally negotiable on UniMart
- If item is sold, say so clearly
- If you don't know something, say so honestly
- Always respond in English
- Keep replies under 100 words"""

        groq_messages = [{"role": "system", "content": system_prompt}] + messages

        text = call_groq(groq_messages)
        print(f"[chat] reply: {text[:100]}...")
        return jsonify({"reply": text})

    except Exception as e:
        print(f"[chat] error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Starting UniMart AI Service on port 8000...")
    app.run(host="0.0.0.0", port=8000, debug=True)