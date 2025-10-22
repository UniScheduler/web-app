import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "../context/ScheduleContext";
import { useHistory } from "../context/HistoryContext";
import toast from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  AcademicCapIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  ClockIcon as HistoryIcon,
  EyeIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const API_HOST =
  process.env.REACT_APP_API_HOST || "http://localhost:8000";

const SchedulerPage = () => {
  const navigate = useNavigate();
  const {
    setLoading,
    setError,
    setCurrentSchedule,
    saveSchedule,
    preferences,
    setPreferences,
    sessionData,
    setSessionData,
    clearSessionData,
    loading,
  } = useSchedule();
  const {
    requestHistory,
    addRequest,
    deleteRequest,
    clearHistory,
  } = useHistory();

  const [courses, setCourses] = useState(
    sessionData.courses || [{ courseCode: "" }]
  );
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(
    sessionData.semester || ""
  );
  const [showHistory, setShowHistory] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState(null);
  const [checkingWaitlist, setCheckingWaitlist] = useState(false);

  const generateSemesterOptions = useCallback(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let currentSemester;
    if (currentMonth >= 0 && currentMonth <= 4) {
      currentSemester = "Spring";
    } else if (currentMonth >= 5 && currentMonth <= 7) {
      currentSemester = "Summer";
    } else {
      currentSemester = "Fall";
    }

    const options = [];
    let year = currentYear;
    let semester = currentSemester;

    for (let i = 0; i < 3; i++) {
      let termYearCode;
      if (semester === "Spring") {
        termYearCode = `${year}01`;
      } else if (semester === "Summer") {
        termYearCode = `${year}06`;
      } else {
        termYearCode = `${year}09`;
      }

      options.push({
        display: `${semester} ${year}`,
        termYear: termYearCode,
      });

      if (semester === "Spring") {
        semester = "Summer";
      } else if (semester === "Summer") {
        semester = "Fall";
      } else {
        semester = "Spring";
        year++;
      }
    }

    setSemesterOptions(options);
    if (!selectedSemester) {
      setSelectedSemester(options[0].termYear);
    }
  }, [selectedSemester]);

  useEffect(() => {
    generateSemesterOptions();
    checkWaitlistStatus();
  }, [generateSemesterOptions]);

  const checkWaitlistStatus = async () => {
    setCheckingWaitlist(true);
    try {
      const response = await fetch(`${API_HOST}/api/waitlist_status`);
      const data = await response.json();
      setWaitlistStatus(data);
    } catch (error) {
      console.error("Error checking waitlist status:", error);
      setWaitlistStatus(null);
    } finally {
      setCheckingWaitlist(false);
    }
  };

  // Load session data when component mounts
  useEffect(() => {
    if (sessionData.courses && sessionData.courses.length > 0) {
      setCourses(sessionData.courses);
    }
    if (sessionData.semester) {
      setSelectedSemester(sessionData.semester);
    }
  }, [sessionData]);

  const parseCourseCode = (courseCode) => {
    if (!courseCode || typeof courseCode !== "string") {
      return { department: "", number: "" };
    }

    const cleaned = courseCode.trim().toUpperCase();
    const match = cleaned.match(/^([A-Z]{2,4})[^0-9]*(\d{3,4})$/);

    if (match) {
      return {
        department: match[1],
        number: match[2],
      };
    }

    const parts = cleaned.split(/[\s\-_]+/);
    if (parts.length >= 2) {
      const department = parts[0];
      const number = parts[1];

      if (/^[A-Z]{2,4}$/.test(department) && /^\d{3,4}$/.test(number)) {
        return { department, number };
      }
    }

    return { department: cleaned, number: "" };
  };

  const isValidCourseCode = (courseCode) => {
    if (!courseCode || typeof courseCode !== "string") return false;

    const cleaned = courseCode.trim().toUpperCase();
    const patterns = [
      /^[A-Z]{2,4}\s+\d{3,4}$/,
      /^[A-Z]{2,4}\d{3,4}$/,
      /^[A-Z]{2,4}-\d{3,4}$/,
      /^[A-Z]{2,4}_\d{3,4}$/,
    ];

    return patterns.some((pattern) => pattern.test(cleaned));
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];

    if (field === "courseCode") {
      newCourses[index] = { ...newCourses[index], courseCode: value };

      // Auto-format the course code as user types
      if (value) {
        const formatted = value.trim().toUpperCase();
        // Add space after department if missing
        const withSpace = formatted.replace(/^([A-Z]{2,4})(\d{3,4})$/, "$1 $2");
        newCourses[index].courseCode = withSpace;
      }
    } else {
      newCourses[index][field] = value;
    }

    setCourses(newCourses);

    // Save to session data
    setSessionData({ courses: newCourses });
  };

  const addCourse = () => {
    const newCourses = [...courses, { courseCode: "" }];
    setCourses(newCourses);

    // Save to session data
    setSessionData({ courses: newCourses });
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      const newCourses = courses.filter((_, i) => i !== index);
      setCourses(newCourses);

      // Save to session data
      setSessionData({ courses: newCourses });
    }
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);

    // Save to session data
    setSessionData({ semester });
  };

  const handlePreferencesChange = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const handleClearForm = () => {
    setCourses([{ courseCode: "" }]);
    setSelectedSemester(semesterOptions[0]?.termYear || "");
    setPreferences({ schedulePreferences: "", email: "" });
    clearSessionData();
    toast.success("Form cleared successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check waitlist status first
    if (waitlistStatus && !waitlistStatus.can_accept_requests) {
      toast.error("Service is currently overloaded. Please wait 1 hour and try again.");
      return;
    }

    // Validation
    for (let course of courses) {
      if (!course.courseCode) {
        toast.error("Course code is required for each course.");
        return;
      }

      if (!isValidCourseCode(course.courseCode)) {
        toast.error(
          `Invalid course code format: ${course.courseCode}. Please use format like "CS 1114" or "CS1114".`
        );
        return;
      }
    }

    if (!selectedSemester) {
      toast.error("Please select a semester.");
      return;
    }

    setLoading(true);
    setError(null);

    // Show loading toast immediately
    toast.loading("Generating your schedule...", {
      id: "schedule",
      duration: Infinity, // Keep the toast until we dismiss it
    });

    try {
      // Parse course codes for the API
      const parsedCourses = courses.map((course) => {
        const { department, number } = parseCourseCode(course.courseCode);
        return {
          department,
          number,
        };
      });

      console.log("SchedulerPage API_HOST:", API_HOST);
      console.log(
        "Making fetch request to:",
        `${API_HOST}/api/submit_request`
      );
      console.log("Request data:", {
        courses: parsedCourses,
        preferences: preferences.schedulePreferences,
        term_year: selectedSemester,
        email: preferences.email || undefined,
      });

      const response = await fetch(`${API_HOST}/api/submit_request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courses: parsedCourses,
          preferences: preferences.schedulePreferences,
          term_year: selectedSemester,
          email: preferences.email || undefined,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Backend server is not responding. Please check if the server is running."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        if (data.cooldown_mode) {
          toast.error(
            "Service is currently in cooldown mode. Please try again later.",
            { id: "schedule" }
          );
          setError("Service is currently in cooldown mode. Please try again later.");
          return;
        }
        throw new Error(data.error || "Failed to submit request");
      }

      toast.success("Request submitted successfully! Redirecting to status page...", {
        id: "schedule",
        duration: 3000,
      });

      // Save request to history
      addRequest({
        id: data.request_id,
        courses: courses.map(course => course.courseCode),
        semester: selectedSemester,
        preferences: preferences.schedulePreferences,
        email: preferences.email,
        status: 'submitted'
      });

      // Navigate to status page
      navigate(`/schedule/${data.request_id}`);
    } catch (error) {
      console.error("Error generating schedule:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });

      let errorMessage = "Failed to generate schedule. Please try again.";

      if (error.message.includes("Backend server is not responding")) {
        errorMessage =
          "Backend server is not running. Please check if the server is accessible.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Cannot connect to the server. Please check if the backend is running.";
      } else if (error.message.includes("Unexpected token")) {
        errorMessage =
          "Server returned an invalid response. Please check if the backend is running correctly.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage, { id: "schedule" });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md mx-4">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="animate-spin h-12 w-12 text-[#861F41] dark:text-[#E5751F]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Generating Your Schedule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
              This may take a few moments. Please don't close this page.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-4 bg-[#861F41] dark:bg-[#E5751F] rounded-2xl shadow-lg">
              <AcademicCapIcon className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Create Your Virginia Tech Schedule
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enter your Virginia Tech courses and preferences to generate an
            optimal, conflict-free schedule using our production backend.
          </p>
          
          {/* Waitlist Status Indicator */}
          {waitlistStatus && !waitlistStatus.can_accept_requests && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                    Service is currently overloaded. Please wait 1 hour and try again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        {requestHistory.length > 0 && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-[#861F41] dark:bg-[#E5751F] rounded-lg mr-3">
                    <HistoryIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Schedule Requests ({requestHistory.length})
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-[#861F41] dark:text-[#E5751F] hover:text-[#6B1934] dark:hover:text-[#D46A1C] font-medium"
                  >
                    {showHistory ? 'Hide' : 'Show'} History
                  </button>
                  <button
                    onClick={() => {
                      clearHistory();
                      toast.success("History cleared successfully!");
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {showHistory && (
                <div className="space-y-3">
                  {requestHistory.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.courses.join(', ')}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(request.timestamp).toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : request.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        {request.preferences && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {request.preferences}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // Populate form with this request's data
                            const parsedCourses = request.courses.map(courseCode => ({ courseCode }));
                            setCourses(parsedCourses);
                            setSelectedSemester(request.semester);
                            setPreferences({
                              schedulePreferences: request.preferences || '',
                              email: request.email || ''
                            });
                            setSessionData({
                              courses: parsedCourses,
                              semester: request.semester
                            });
                            toast.success("Form populated with previous request data");
                          }}
                          className="px-3 py-1 text-xs bg-[#861F41] dark:bg-[#E5751F] text-white hover:bg-[#6B1934] dark:hover:bg-[#D46A1C] rounded-md transition-colors"
                          title="Use This Data"
                        >
                          Use This
                        </button>
                        <button
                          onClick={() => navigate(`/schedule/${request.id}`)}
                          className="p-2 text-[#861F41] dark:text-[#E5751F] hover:bg-[#861F41]/10 dark:hover:bg-[#E5751F]/10 rounded-lg transition-colors"
                          title="View Schedule"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            deleteRequest(request.id);
                            toast.success("Request removed from history");
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove from History"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {requestHistory.length > 5 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Showing 5 most recent requests
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Semester Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 bg-[#861F41] dark:bg-[#E5751F] rounded-lg mr-3">
                <ClockIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Virginia Tech Semester Selection
              </h2>
            </div>
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#861F41] dark:focus:ring-[#E5751F] focus:border-[#861F41] dark:focus:border-[#E5751F] dark:bg-gray-700 dark:text-white transition-colors duration-200 text-base"
            >
              {semesterOptions.map((option) => (
                <option key={option.termYear} value={option.termYear}>
                  {option.display}
                </option>
              ))}
            </select>
          </div>

          {/* Courses Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center">
                <div className="p-2 bg-[#861F41] dark:bg-[#E5751F] rounded-lg mr-3">
                  <AcademicCapIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Virginia Tech Courses
                </h2>
              </div>
              <button
                type="button"
                onClick={addCourse}
                className="inline-flex items-center px-4 py-2 bg-[#861F41] hover:bg-[#6B1934] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Course
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={course.courseCode}
                      onChange={(e) =>
                        handleCourseChange(index, "courseCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#861F41] dark:focus:ring-[#E5751F] focus:border-[#861F41] dark:focus:border-[#E5751F] dark:bg-gray-600 dark:text-white transition-colors duration-200 text-sm"
                      placeholder="e.g., CS 1114 or CS1114"
                      required
                    />
                    {course.courseCode &&
                      !isValidCourseCode(course.courseCode) && (
                        <p className="text-xs text-red-500 mt-1">
                          Use format like "CS 1114" or "CS1114"
                        </p>
                      )}
                  </div>
                  
                  {courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 bg-[#861F41] dark:bg-[#E5751F] rounded-lg mr-3">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Virginia Tech Schedule Preferences
              </h2>
            </div>
            <textarea
              value={preferences.schedulePreferences}
              onChange={(e) =>
                handlePreferencesChange({ schedulePreferences: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#861F41] dark:focus:ring-[#E5751F] focus:border-[#861F41] dark:focus:border-[#E5751F] dark:bg-gray-700 dark:text-white transition-colors duration-200 resize-y text-sm"
              rows="4"
              placeholder="e.g., No classes before 10 AM, prefer afternoon classes on T/Th, need a lunch break between 12-1 PM, want classes close together"
            />
          </div>

          {/* Email Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 bg-[#861F41] dark:bg-[#E5751F] rounded-lg mr-3">
                <EnvelopeIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Email (Optional)
              </h2>
            </div>
            <input
              type="email"
              value={preferences.email}
              onChange={(e) =>
                handlePreferencesChange({ email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#861F41] dark:focus:ring-[#E5751F] focus:border-[#861F41] dark:focus:border-[#E5751F] dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm"
              placeholder="Enter your Virginia Tech email (optional)"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              We'll use this to send you updates about your Virginia Tech
              schedule generation.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleClearForm}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading || (waitlistStatus && !waitlistStatus.can_accept_requests)}
              className="inline-flex items-center px-8 py-4 bg-[#861F41] hover:bg-[#6B1934] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Schedule"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulerPage;
