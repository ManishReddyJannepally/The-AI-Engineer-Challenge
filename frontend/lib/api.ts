/**
 * API client for communicating with the FastAPI backend
 */

import { MealPreferences } from '../components/MealPreferences';

interface ChatRequest {
  message: string;
  preferences?: MealPreferences;
}

interface ChatResponse {
  reply: string;
}

/**
 * Get the API base URL and endpoint path based on the environment
 * In production (Vercel), the API is at /api/index/chat
 * In development, it points to localhost:8000/api/chat
 */
function getApiEndpoint(): string {
  // Check if we're in development (localhost)
  if (typeof window !== 'undefined') {
    // Client-side: check if we're on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/chat';
    }
    // Production: use /api/chat (Vercel routes frontend/api/chat.py to /api/chat)
    return '/api/chat';
  }
  // Server-side: use environment variable or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${apiUrl}/api/chat`;
}

/**
 * Format preferences into a context string for the AI
 * @param preferences - User meal preferences
 * @returns Formatted string with preferences context
 */
function formatPreferencesContext(preferences: MealPreferences): string {
  const parts: string[] = [];
  
  if (preferences.country) parts.push(`Country: ${preferences.country}`);
  if (preferences.diet) parts.push(`Diet: ${preferences.diet}`);
  if (preferences.budgetLevel) parts.push(`Budget: ${preferences.budgetLevel}`);
  if (preferences.prepTime) parts.push(`Prep Time: ${preferences.prepTime} minutes`);
  if (preferences.preferredStore) parts.push(`Preferred Store: ${preferences.preferredStore}`);
  
  return parts.length > 0 ? `\n\nUser Preferences:\n${parts.join('\n')}` : '';
}

/**
 * Send a chat message to the backend API
 * @param message - The user's message
 * @param preferences - Optional user meal preferences to include in context
 * @returns Promise resolving to the assistant's reply
 */
export async function sendMessage(
  message: string,
  preferences?: MealPreferences
): Promise<ChatResponse> {
  // Get the correct endpoint based on environment
  const url = getApiEndpoint();
  
  // Debug: log the URL being used (only in browser)
  if (typeof window !== 'undefined') {
    console.log('API Endpoint:', url);
    console.log('Hostname:', window.location.hostname);
  }
  
  // Include preferences in the message context if provided
  const messageWithContext = preferences
    ? `${message}${formatPreferencesContext(preferences)}`
    : message;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: messageWithContext } as ChatRequest),
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch (textError) {
        // If that also fails, use the status-based message
      }
    }
    // Add URL to error for debugging
    console.error('API Error:', { url, status: response.status, error: errorMessage });
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Check if the backend API is healthy
 * @returns Promise resolving to health status
 */
export async function checkHealth(): Promise<{ status: string }> {
  // Check if we're in development (localhost)
  let url: string;
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      url = 'http://localhost:8000/';
    } else {
      url = '/api/index/';
    }
  } else {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    url = `${apiUrl}/`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Health check failed! status: ${response.status}`);
  }

  return response.json();
}
