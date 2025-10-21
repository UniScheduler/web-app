import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import SchedulerPage from "./pages/SchedulerPage";
import ScheduleViewerPage from "./pages/ScheduleViewerPage";
import AboutPage from "./pages/AboutPage";
import { ScheduleProvider } from "./context/ScheduleContext";
import "./App.css";

function App() {
  return (
    <ScheduleProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scheduler" element={<SchedulerPage />} />
              <Route path="/schedule/:id" element={<ScheduleViewerPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#f9fafb",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "14px",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#f9fafb",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#f9fafb",
                },
              },
            }}
          />
        </div>
      </Router>
    </ScheduleProvider>
  );
}

export default App;
