# Vercel FastAPI entrypoint - required for detection
# This file exists only so Vercel can detect FastAPI
# The actual endpoint is in chat.py

from chat import app

# Export app for Vercel
__all__ = ["app"]
