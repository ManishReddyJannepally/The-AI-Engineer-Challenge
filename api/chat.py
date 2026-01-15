from openai import OpenAI
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client (will be initialized in handler if key exists)
openai_api_key = os.getenv("OPENAI_API_KEY")

def handler(request):
    """
    Vercel serverless function handler for chat endpoint
    Vercel passes the request as a dictionary with 'body' key
    """
    try:
        # Check if API key is configured
        if not openai_api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'detail': 'OPENAI_API_KEY not configured'})
            }
        
        # Initialize client
        client = OpenAI(api_key=openai_api_key)
        
        # Vercel passes request as a dict with 'body' as a string
        if isinstance(request, dict):
            body_str = request.get('body', '{}')
            body = json.loads(body_str) if isinstance(body_str, str) else body_str
        else:
            # Fallback for other formats
            body = getattr(request, 'body', {})
            if isinstance(body, str):
                body = json.loads(body)
        
        # Extract message
        message = body.get('message', '') if isinstance(body, dict) else ''
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                'body': json.dumps({'detail': 'Message is required'})
            }
        
        # Call OpenAI API
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
                {"role": "user", "content": message}
            ]
        )
        
        reply = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'reply': reply})
        }
        
    except Exception as e:
        error_message = str(e)
        if "api key" in error_message.lower() or "authentication" in error_message.lower():
            error_message = "OpenAI API key is invalid or missing."
        elif "model" in error_message.lower():
            error_message = f"Model error: {error_message}"
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'detail': f'Error calling OpenAI API: {error_message}'})
        }

