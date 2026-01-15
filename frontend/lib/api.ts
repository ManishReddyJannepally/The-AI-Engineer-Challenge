/**
 * API client for communicating with the FastAPI backend
 */

import { MealPreferences } from '@/components/MealPreferences';

interface ChatRequest {
  message: string;
  preferences?: MealPreferences;
}

interface ChatResponse {
  reply: string;
}

/**
 * Get the API base URL based on the environment
 * In production (Vercel), the API is served from the same domain
 * In development, it points to localhost:8000
 */
function getApiUrl(): string {
  // In production on Vercel, the API routes are handled by the backend
  // The Next.js rewrites will handle routing /api/* to the backend
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL which will be handled by Next.js rewrites
    return '';
  }
  // Server-side: use environment variable or default to localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
  const apiUrl = getApiUrl();
  const url = apiUrl ? `${apiUrl}/api/chat` : '/api/chat';
  
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
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Check if the backend API is healthy
 * @returns Promise resolving to health status
 */
export async function checkHealth(): Promise<{ status: string }> {
  const apiUrl = getApiUrl();
  const url = apiUrl ? `${apiUrl}/` : '/api';
  
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Health check failed! status: ${response.status}`);
  }

  return response.json();
}

