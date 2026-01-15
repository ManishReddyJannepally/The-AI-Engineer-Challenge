'use client';

/**
 * MealPreferences Component
 * 
 * Form component for collecting user meal planning preferences:
 * - Country selection
 * - Diet type
 * - Budget level
 * - Prep time preference
 * - Preferred grocery store
 */

export interface MealPreferences {
  country: string;
  diet: string;
  budgetLevel: string;
  prepTime: number;
  preferredStore: string;
}

interface MealPreferencesProps {
  preferences: MealPreferences;
  onPreferencesChange: (preferences: MealPreferences) => void;
}

export default function MealPreferences({
  preferences,
  onPreferencesChange,
}: MealPreferencesProps) {
  const handleChange = (field: keyof MealPreferences, value: string | number) => {
    onPreferencesChange({
      ...preferences,
      [field]: value,
    });
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #e0e0e0',
        borderRadius: '8px 8px 0 0',
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px',
        }}
      >
        📋 Your Preferences
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Country Selection */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#555',
              marginBottom: '6px',
            }}
          >
            Country
          </label>
          <select
            value={preferences.country}
            onChange={(e) => handleChange('country', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: '#ffffff',
              color: '#333333',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            <option value="">Select Country</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="US">US</option>
          </select>
        </div>

        {/* Diet Type */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#555',
              marginBottom: '6px',
            }}
          >
            Diet
          </label>
          <select
            value={preferences.diet}
            onChange={(e) => handleChange('diet', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: '#ffffff',
              color: '#333333',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            <option value="">Select Diet</option>
            <option value="Veg">Vegetarian</option>
            <option value="Egg">Egg (Vegetarian + Eggs)</option>
            <option value="Chicken">Chicken</option>
            <option value="Vegan">Vegan</option>
          </select>
        </div>

        {/* Budget Level */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#555',
              marginBottom: '6px',
            }}
          >
            Budget Level
          </label>
          <select
            value={preferences.budgetLevel}
            onChange={(e) => handleChange('budgetLevel', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: '#ffffff',
              color: '#333333',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            <option value="">Select Budget</option>
            <option value="Low">Low ($20-30/week)</option>
            <option value="Medium">Medium ($30-50/week)</option>
            <option value="High">High ($50+/week)</option>
          </select>
        </div>

        {/* Prep Time Slider */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#555',
              marginBottom: '6px',
            }}
          >
            Prep Time: {preferences.prepTime} minutes
          </label>
          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={preferences.prepTime}
            onChange={(e) => handleChange('prepTime', parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: '#e0e0e0',
              outline: 'none',
              cursor: 'pointer',
              WebkitAppearance: 'none',
              appearance: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d0d0d0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#888',
              marginTop: '4px',
            }}
          >
            <span>15 min</span>
            <span>120 min</span>
          </div>
        </div>

        {/* Preferred Store */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#555',
              marginBottom: '6px',
            }}
          >
            Preferred Store
          </label>
          <select
            value={preferences.preferredStore}
            onChange={(e) => handleChange('preferredStore', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: '#ffffff',
              color: '#333333',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            <option value="">Select Store</option>
            <option value="Walmart">Walmart</option>
            <option value="Target">Target</option>
            <option value="Freshco">Freshco</option>
            <option value="NoFrills">No Frills</option>
          </select>
        </div>
      </div>
    </div>
  );
}

