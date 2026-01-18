# Vercel FastAPI entrypoint
# This file is required by Vercel to detect the FastAPI app
# It imports the app from chat.py

from chat import app

# Export the app for Vercel
__all__ = ["app"]

