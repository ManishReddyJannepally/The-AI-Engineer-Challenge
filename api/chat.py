from http.server import BaseHTTPRequestHandler
import json
import os
from openai import OpenAI

SYSTEM_PROMPT = """
                You are a helpful meal prep planner assistant specializing in helping Indian students studying abroad. 
                You understand the challenges of balancing busy schedules with studies and part-time work, and you know how much Indian students miss home food while living in western countries. 
                You help create practical, time-efficient meal prep plans that incorporate Indian flavors and comfort foods. 
                You provide recipes that are budget-friendly, can be prepared in advance, and make students feel connected to home. 
                You're warm, understanding, and practical in your advice.
                
                - Prioritize: 30–60 min meal prep, minimal cooking skills, low cleanup
                - Use ingredients available in western grocery stores (Walmart/Costco/No Frills/Metro/Tesco)
                - Give exact meal plan + grocery list + meal prep steps
                - Avoid overly fancy recipes

                Ask 2-3 clarification questions ONLY if needed.
                Always output in this format:

                1) Meal Plan (2–3 days or 5 days depending on user request)
                2) Grocery List (grouped: Proteins, Carbs, Veggies, Pantry/Spices)
                3) Meal Prep Plan (Step-by-step Sunday prep)
                4) Storage Tips (fridge/freezer)
                5) Estimated Cost Range (rough)
""".strip()


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "OPENAI_API_KEY not configured"}).encode())
                return

            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            data = json.loads(body or "{}")

            message = data.get("message", "").strip()
            if not message:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing 'message'"}).encode())
                return

            client = OpenAI(api_key=api_key)

            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message},
                ],
            )

            reply = resp.choices[0].message.content

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"reply": reply}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_OPTIONS(self):
        # CORS preflight
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
