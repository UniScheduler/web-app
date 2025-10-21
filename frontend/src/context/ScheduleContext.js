import React, { createContext, useContext, useReducer, useEffect } from "react";

const ScheduleContext = createContext();

const initialState = {
  currentSchedule: null,
  savedSchedules: [],
  loading: false,
  error: null,
  preferences: {
    schedulePreferences: "",
    email: "",
  },
  sessionData: {
    courses: [{ department: "", number: "", professor: "" }],
    semester: "",
  },
};

const scheduleReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_CURRENT_SCHEDULE":
      return { ...state, currentSchedule: action.payload };
    case "SAVE_SCHEDULE":
      const updatedSchedules = [...state.savedSchedules, action.payload];
      localStorage.setItem("savedSchedules", JSON.stringify(updatedSchedules));
      return { ...state, savedSchedules: updatedSchedules };
    case "DELETE_SCHEDULE":
      const filteredSchedules = state.savedSchedules.filter(
        (schedule) => schedule.id !== action.payload
      );
      localStorage.setItem("savedSchedules", JSON.stringify(filteredSchedules));
      return { ...state, savedSchedules: filteredSchedules };
    case "SET_PREFERENCES":
      const newPreferences = { ...state.preferences, ...action.payload };
      localStorage.setItem(
        "schedulePreferences",
        JSON.stringify(newPreferences)
      );
      return { ...state, preferences: newPreferences };
    case "SET_SESSION_DATA":
      const newSessionData = { ...state.sessionData, ...action.payload };
      localStorage.setItem("sessionData", JSON.stringify(newSessionData));
      return { ...state, sessionData: newSessionData };
    case "CLEAR_SESSION_DATA":
      localStorage.removeItem("sessionData");
      return {
        ...state,
        sessionData: {
          courses: [{ department: "", number: "", professor: "" }],
          semester: "",
        },
      };
    case "LOAD_SAVED_DATA":
      return {
        ...state,
        savedSchedules: action.payload.savedSchedules || [],
        preferences: action.payload.preferences || initialState.preferences,
        sessionData: action.payload.sessionData || initialState.sessionData,
      };
    default:
      return state;
  }
};

export const ScheduleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      const savedSchedules = JSON.parse(
        localStorage.getItem("savedSchedules") || "[]"
      );
      const preferences = JSON.parse(
        localStorage.getItem("schedulePreferences") || "null"
      );
      const sessionData = JSON.parse(
        localStorage.getItem("sessionData") || "null"
      );

      dispatch({
        type: "LOAD_SAVED_DATA",
        payload: {
          savedSchedules,
          preferences: preferences || initialState.preferences,
          sessionData: sessionData || initialState.sessionData,
        },
      });
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const setCurrentSchedule = (schedule) => {
    dispatch({ type: "SET_CURRENT_SCHEDULE", payload: schedule });
  };

  const saveSchedule = (schedule) => {
    dispatch({ type: "SAVE_SCHEDULE", payload: schedule });
  };

  const deleteSchedule = (scheduleId) => {
    dispatch({ type: "DELETE_SCHEDULE", payload: scheduleId });
  };

  const setPreferences = (preferences) => {
    dispatch({ type: "SET_PREFERENCES", payload: preferences });
  };

  const setSessionData = (sessionData) => {
    dispatch({ type: "SET_SESSION_DATA", payload: sessionData });
  };

  const clearSessionData = () => {
    dispatch({ type: "CLEAR_SESSION_DATA" });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setCurrentSchedule,
    saveSchedule,
    deleteSchedule,
    setPreferences,
    setSessionData,
    clearSessionData,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};
