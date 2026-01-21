from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app - Vercel requires this in api/index.py
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
client = None
if openai_api_key:
    client = OpenAI(api_key=openai_api_key)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
@app.get("")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "API is working"}

@app.post("/chat")
@app.post("chat")
async def chat(request: ChatRequest):
    """
    Chat endpoint - accessible at /api/index/chat
    But we'll configure Vercel to rewrite /api/chat to /api/index/chat
    """
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI client not initialized")
    
    try:
        user_message = request.message
        response = client.chat.completions.create(
            model="gpt-4o-mini",
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
        error_message = str(e)
        if "api key" in error_message.lower() or "authentication" in error_message.lower():
            error_message = "OpenAI API key is invalid or missing."
        elif "model" in error_message.lower():
            error_message = f"Model error: {error_message}"
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {error_message}")
