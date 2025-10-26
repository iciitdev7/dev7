// Local storage utility functions for persisting app data

const STORAGE_KEYS = {
  APP_STATE: 'salesmind_app_state',
  USER_PREFERENCES: 'salesmind_user_preferences',
  LANGUAGE: 'salesmind_language'
};

// Safe JSON parsing with fallback
function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return fallback;
  }
}

// Safe localStorage operations with error handling
export const storage = {
  // Get item from localStorage
  getItem: (key) => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error);
      return null;
    }
  },

  // Set item in localStorage
  setItem: (key, value) => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to set item in localStorage:', error);
      return false;
    }
  },

  // Remove item from localStorage
  removeItem: (key) => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove item from localStorage:', error);
      return false;
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
};

// App state persistence functions
export const appStorage = {
  // Save complete app state
  saveAppState: (state) => {
    const serializedState = JSON.stringify({
      ...state,
      lastSaved: new Date().toISOString()
    });
    return storage.setItem(STORAGE_KEYS.APP_STATE, serializedState);
  },

  // Load app state from storage
  loadAppState: () => {
    const savedState = storage.getItem(STORAGE_KEYS.APP_STATE);
    if (!savedState) return null;
    
    const parsedState = safeJsonParse(savedState);
    if (!parsedState) return null;

    // Validate state structure
    if (typeof parsedState !== 'object' || !parsedState.hasOwnProperty('assessmentCompleted')) {
      console.warn('Invalid app state structure in localStorage');
      return null;
    }

    return parsedState;
  },

  // Save user preferences
  saveUserPreferences: (preferences) => {
    const serializedPrefs = JSON.stringify({
      ...preferences,
      lastUpdated: new Date().toISOString()
    });
    return storage.setItem(STORAGE_KEYS.USER_PREFERENCES, serializedPrefs);
  },

  // Load user preferences
  loadUserPreferences: () => {
    const savedPrefs = storage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (!savedPrefs) return null;
    
    return safeJsonParse(savedPrefs);
  },

  // Save language preference
  saveLanguage: (language) => {
    return storage.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  // Load language preference
  loadLanguage: () => {
    return storage.getItem(STORAGE_KEYS.LANGUAGE);
  },

  // Clear all app data
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.removeItem(key);
    });
  },

  // Export data for backup
  exportData: () => {
    const appState = appStorage.loadAppState();
    const userPreferences = appStorage.loadUserPreferences();
    const language = appStorage.loadLanguage();

    return {
      appState,
      userPreferences,
      language,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  },

  // Import data from backup
  importData: (data) => {
    try {
      if (data.appState) {
        appStorage.saveAppState(data.appState);
      }
      if (data.userPreferences) {
        appStorage.saveUserPreferences(data.userPreferences);
      }
      if (data.language) {
        appStorage.saveLanguage(data.language);
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
};

// Utility to check localStorage availability
export const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Migration utility for future schema changes
export const migrateData = (currentVersion = '1.0') => {
  const savedState = appStorage.loadAppState();
  if (!savedState) return null;

  // Add migration logic here for future versions
  // Example:
  // if (savedState.version < '1.1') {
  //   // Perform migration
  // }

  return savedState;
};