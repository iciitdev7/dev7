'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { useEffect } from 'react';
import { mockSkills } from '../data/mockData';
import { appStorage, isStorageAvailable } from '../utils/localStorage';

const AppContext = createContext();

const initialState = {
  assessmentCompleted: false,
  userSkills: mockSkills,
  completedDrills: [],
  assessmentAnswers: {},
  currentUser: {
    name: 'Alex Johnson',
    role: 'Sales Representative',
    joinDate: '2024-12-01'
  },
  dataLoaded: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_SAVED_STATE':
      return {
        ...state,
        ...action.payload,
        dataLoaded: true
      };
    case 'COMPLETE_ASSESSMENT':
      const assessmentState = {
        ...state,
        assessmentCompleted: true,
        assessmentAnswers: action.payload.answers,
        userSkills: action.payload.calculatedSkills
      };
      // Save to localStorage
      appStorage.saveAppState(assessmentState);
      return assessmentState;
    case 'COMPLETE_DRILL':
      const drillState = {
        ...state,
        completedDrills: [...state.completedDrills, {
          id: action.payload.drillId,
          skillId: action.payload.skillId,
          completedAt: new Date().toISOString(),
          ...action.payload.data
        }]
      };
      // Save to localStorage
      appStorage.saveAppState(drillState);
      return drillState;
    case 'UPDATE_SKILL_SCORE':
      const skillState = {
        ...state,
        userSkills: state.userSkills.map(skill =>
          skill.id === action.payload.skillId
            ? { ...skill, score: action.payload.newScore }
            : skill
        )
      };
      // Save to localStorage
      appStorage.saveAppState(skillState);
      return skillState;
    case 'CLEAR_ALL_DATA':
      appStorage.clearAllData();
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    if (isStorageAvailable()) {
      const savedState = appStorage.loadAppState();
      if (savedState) {
        // Merge saved state with initial state, preserving structure
        const mergedState = {
          ...initialState,
          ...savedState,
          // Ensure userSkills maintains the latest structure from mockSkills
          userSkills: savedState.userSkills || mockSkills,
          // Ensure arrays exist
          completedDrills: savedState.completedDrills || [],
          assessmentAnswers: savedState.assessmentAnswers || {}
        };
        
        dispatch({
          type: 'LOAD_SAVED_STATE',
          payload: mergedState
        });
      } else {
        // No saved state, mark as loaded
        dispatch({
          type: 'LOAD_SAVED_STATE',
          payload: { dataLoaded: true }
        });
      }
    }
  }, []);

  // Auto-save state changes (debounced)
  useEffect(() => {
    if (state.dataLoaded) {
      const timeoutId = setTimeout(() => {
        appStorage.saveAppState(state);
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [state]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}