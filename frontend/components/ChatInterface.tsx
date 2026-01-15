'use client';

/**
 * ChatInterface Component
 * 
 * A chat interface component for the Meal Prep Planner application.
 * Helps Indian students abroad plan time-efficient, budget-friendly meals
 * that incorporate home-style Indian food into their busy schedules.
 * 
 * Features:
 * - Real-time message display with user/assistant distinction
 * - Auto-scrolling to latest messages
 * - Auto-growing textarea input
 * - Loading states and error handling
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 */

import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '@/lib/api';
import MealPreferences, { MealPreferences as MealPreferencesType } from './MealPreferences';

/**
 * Message interface representing a chat message
 */
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Main chat interface component
 * @returns JSX element containing the chat UI
 */
export default function ChatInterface() {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! 👋 I\'m your meal prep planner assistant. I help Indian students abroad create time-efficient meal plans that bring the comfort of home food to your busy schedule. Whether you\'re juggling studies and part-time work, I\'ll help you plan budget-friendly, make-ahead meals that remind you of home. What would you like help with today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState(''); // Current input text
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  
  // Meal preferences state
  const [preferences, setPreferences] = useState<MealPreferencesType>({
    country: '',
    diet: '',
    budgetLevel: '',
    prepTime: 30, // Default to 30 minutes
    preferredStore: '',
  });
  
  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference to scroll target
  const inputRef = useRef<HTMLTextAreaElement>(null); // Reference to textarea for auto-grow

  /**
   * Scrolls the messages container to the bottom to show the latest message
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Auto-grow textarea to fit content as user types
   * Grows from minimum height (50px) up to maximum height (150px)
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const scrollHeight = inputRef.current.scrollHeight;
      const maxHeight = 150; // Maximum height in pixels before scrolling
      inputRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  /**
   * Handles form submission when user sends a message
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    // Reset textarea height after sending
    if (inputRef.current) {
      inputRef.current.style.height = '50px';
    }
    setIsLoading(true);

    try {
      // Include preferences in the API call
      const response = await sendMessage(userMessage.content, preferences);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Provide more helpful error messages
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        // Show user-friendly error message
        if (error.message.includes('OPENAI_API_KEY')) {
          errorContent = 'Error: OpenAI API key is not configured. Please check your backend setup.';
        } else if (error.message.includes('HTTP error')) {
          errorContent = 'Error: Could not connect to the backend. Please make sure the backend server is running on port 8000.';
        } else {
          errorContent = `Error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  /**
   * Handles keyboard events in the textarea
   * Enter key submits the form, Shift+Enter creates a new line
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '2px solid #e0e0e0',
          backgroundColor: '#ffffff',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '4px',
          }}
        >
          🍛 Meal Prep Planner
        </h1>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Your AI assistant for planning Indian meals that fit your busy student life abroad
        </p>
      </div>

      {/* Meal Preferences Form */}
      <MealPreferences
        preferences={preferences}
        onPreferencesChange={setPreferences}
      />

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: '#f8f9fa',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: message.role === 'user' ? '#667eea' : '#ffffff',
                color: message.role === 'user' ? '#ffffff' : '#333333',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                fontSize: '15px',
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignSelf: 'flex-start',
              maxWidth: '75%',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                color: '#666',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span>Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '20px',
          borderTop: '2px solid #e0e0e0',
          backgroundColor: '#ffffff',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-grow on change
              e.target.style.height = 'auto';
              const scrollHeight = e.target.scrollHeight;
              const maxHeight = 150;
              e.target.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '15px',
              fontFamily: 'inherit',
              resize: 'none',
              minHeight: '50px',
              maxHeight: '150px',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              color: '#333333',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoading || !input.trim() ? '#cccccc' : '#667eea',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              minWidth: '100px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && input.trim()) {
                e.currentTarget.style.backgroundColor = '#5568d3';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && input.trim()) {
                e.currentTarget.style.backgroundColor = '#667eea';
              }
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}

