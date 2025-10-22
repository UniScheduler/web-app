import React, { createContext, useContext, useReducer, useEffect } from "react";

const HistoryContext = createContext();

const initialState = {
  requestHistory: [],
  loading: false,
  error: null,
};

const historyReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_REQUEST":
      const newRequest = {
        id: action.payload.id,
        courses: action.payload.courses,
        semester: action.payload.semester,
        preferences: action.payload.preferences,
        email: action.payload.email,
        timestamp: action.payload.timestamp || new Date().toISOString(),
        status: action.payload.status || 'submitted'
      };
      const updatedHistory = [newRequest, ...state.requestHistory];
      localStorage.setItem("requestHistory", JSON.stringify(updatedHistory));
      return { ...state, requestHistory: updatedHistory };
    case "UPDATE_REQUEST_STATUS":
      const updatedRequests = state.requestHistory.map(req => 
        req.id === action.payload.id 
          ? { ...req, status: action.payload.status }
          : req
      );
      localStorage.setItem("requestHistory", JSON.stringify(updatedRequests));
      return { ...state, requestHistory: updatedRequests };
    case "DELETE_REQUEST":
      const filteredHistory = state.requestHistory.filter(req => req.id !== action.payload);
      localStorage.setItem("requestHistory", JSON.stringify(filteredHistory));
      return { ...state, requestHistory: filteredHistory };
    case "CLEAR_HISTORY":
      localStorage.removeItem("requestHistory");
      return { ...state, requestHistory: [] };
    case "LOAD_HISTORY":
      return { ...state, requestHistory: action.payload };
    default:
      return state;
  }
};

export const HistoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(historyReducer, initialState);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(
        localStorage.getItem("requestHistory") || "[]"
      );
      dispatch({ type: "LOAD_HISTORY", payload: savedHistory });
    } catch (error) {
      console.error("Error loading request history:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load request history" });
    }
  }, []);

  const addRequest = (requestData) => {
    dispatch({ type: "ADD_REQUEST", payload: requestData });
  };

  const updateRequestStatus = (requestId, status) => {
    dispatch({ type: "UPDATE_REQUEST_STATUS", payload: { id: requestId, status } });
  };

  const deleteRequest = (requestId) => {
    dispatch({ type: "DELETE_REQUEST", payload: requestId });
  };

  const clearHistory = () => {
    dispatch({ type: "CLEAR_HISTORY" });
  };

  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const value = {
    ...state,
    addRequest,
    updateRequestStatus,
    deleteRequest,
    clearHistory,
    setLoading,
    setError,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
