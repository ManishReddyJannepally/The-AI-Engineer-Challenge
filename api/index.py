from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize OpenAI client (will be None if key is missing, handled in endpoint)
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key) if openai_api_key else None

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI client not initialized")
    
    try:
        user_message = request.message
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini as it's cost-effective and fast
            messages=[
                {"role": "system", "content": """
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
                
                """},
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        # Provide more detailed error information
        error_message = str(e)
        if "model" in error_message.lower() or "invalid" in error_message.lower():
            error_message = f"Invalid model configuration: {error_message}. Please check the model name in api/index.py"
        elif "api key" in error_message.lower() or "authentication" in error_message.lower():
            error_message = "OpenAI API key is invalid or missing. Please check your OPENAI_API_KEY environment variable."
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {error_message}")
