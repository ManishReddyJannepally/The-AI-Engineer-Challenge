# Vercel FastAPI entrypoint - required for detection
# This is a minimal FastAPI app just for Vercel to detect FastAPI
# The actual endpoint is in chat.py

from fastapi import FastAPI

# Create minimal FastAPI app for Vercel detection
app = FastAPI()

# No routes here - all routes are in chat.py
# This file exists only so Vercel can detect FastAPI framework
