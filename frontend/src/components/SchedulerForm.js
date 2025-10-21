import React, { useState, useEffect } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/solid";

// Get API host from environment variable or use default
const API_HOST =
  process.env.REACT_APP_API_HOST || "https://unischeduler.onrender.com";

function SchedulerForm({ onScheduleGenerated }) {
  console.log("SchedulerForm API_HOST:", API_HOST);
  const [courses, setCourses] = useState([
    { department: "", number: "", professor: "" },
  ]);
  const [preferences, setPreferences] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Generate semester options when component mounts
    const generateSemesterOptions = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      // Determine current semester
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

      // Add current semester and next two
      for (let i = 0; i < 3; i++) {
        // Generate term year code
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

        // Move to next semester
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
      setSelectedSemester(options[0].termYear); // Set default to first option's term year
    };

    generateSemesterOptions();
  }, []);

  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    const newCourses = [...courses];
    newCourses[index][name] = value;
    setCourses(newCourses);
  };

  const deleteCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { department: "", number: "", professor: "" }]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault(); // Prevent default form behavior
        addCourse();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with courses:", courses);
    // Validate: Ensure department and course number fields are filled.
    for (let course of courses) {
      if (!course.department || !course.number) {
        setError("Department and Course Number are required for each course.");
        return;
      }
    }
    setError("");
    setLoading(true);
    setProgress(0);
    setStatusMessage("Validating inputs...");
    try {
      setProgress(5);
      setStatusMessage("Fetching course data...");
      const progressPerCourse = 40 / courses.length;
      for (let i = 0; i < courses.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress((prev) => prev + progressPerCourse);
        setStatusMessage(
          `Fetching data for ${courses[i].department}${courses[i].number}...`
        );
      }
      setStatusMessage("Generating schedule...");
      console.log("Making API call to:", `${API_HOST}/api/generate_schedule`);
      console.log("Request data:", {
        courses,
        preferences,
        term_year: selectedSemester,
        email: email.trim() || undefined,
      });
      const response = await axios.post(`${API_HOST}/api/generate_schedule`, {
        courses,
        preferences,
        term_year: selectedSemester,
        email: email.trim() || undefined,
        // invite_code: inviteCode.trim(), // Commented out invite code requirement
      });
      console.log("API response:", response.data);
      setProgress(90);
      setStatusMessage("Finalizing schedule...");
      if (response.data === "NO_VALID_SCHEDULE_FOUND") {
        setError(
          "No valid schedule found. Please try different courses or preferences."
        );
        onScheduleGenerated(null);
      } else {
        setProgress(100);
        setStatusMessage("Schedule generated successfully!");
        onScheduleGenerated(response.data);
      }
    } catch (err) {
      console.error("API call failed:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });
      // Commented out invite code specific error handling
      // if (err.response?.status === 401) {
      //   setError("Invalid invite code.");
      // } else {
      setError("Failed to generate schedule. Please try again.");
      // }
      onScheduleGenerated(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setStatusMessage("");
      }, 1000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-5"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#861F41] dark:text-[#E5751F]">
          Enter Courses
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#75787B] dark:text-gray-400">
            Semester:
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#E5751F] focus:border-[#E5751F] dark:bg-gray-800 dark:text-white py-1 pl-2 pr-8 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
          >
            {semesterOptions.map((option) => (
              <option key={option.termYear} value={option.termYear}>
                {option.display}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex flex-wrap items-end gap-3 mb-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
          >
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-[#75787B] dark:text-gray-400 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={course.department}
                onChange={(e) => handleCourseChange(index, e)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#E5751F] focus:border-[#E5751F] dark:bg-gray-800 dark:text-white"
                required
                placeholder="CS"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-[#75787B] dark:text-gray-400 mb-1">
                Course Number
              </label>
              <input
                type="text"
                name="number"
                value={course.number}
                onChange={(e) => handleCourseChange(index, e)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#E5751F] focus:border-[#E5751F] dark:bg-gray-800 dark:text-white"
                required
                placeholder="1114"
              />
            </div>
            <button
              type="button"
              onClick={() => deleteCourse(index)}
              className="w-8 h-8 bg-[#861F41] hover:bg-[#6B1934] flex items-center justify-center rounded-md transition-colors"
              title="Delete Course"
            >
              <TrashIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
      <div className="mb-4 mt-4">
        <button
          type="button"
          onClick={addCourse}
          className="text-sm bg-[#E5751F] hover:bg-[#D46A1C] text-white px-3 py-1.5 rounded-md transition-colors"
        >
          Add Another Course
        </button>
        <span className="ml-3 text-xs text-[#75787B] dark:text-gray-400">
          Pro tip: Press Shift+Enter to quickly add a new course
        </span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#75787B] dark:text-gray-400 mb-1">
          Schedule Preferences
        </label>
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#E5751F] focus:border-[#E5751F] dark:bg-gray-800 dark:text-white resize-y"
          rows="2"
          placeholder="e.g., No classes before 10 AM, prefer afternoon classes on T/Th, need a lunch break between 12-1 PM, want classes close together"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#75787B] dark:text-gray-400 mb-1">
          Email (optional)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#E5751F] focus:border-[#E5751F] dark:bg-gray-800 dark:text-white"
          placeholder="Enter your email (optional)"
        />
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mb-2">{error}</p>
      )}

      {loading && (
        <div className="mb-4">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#861F41] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-[#75787B] dark:text-gray-400 mt-2">
            {statusMessage}
          </p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="text-sm bg-[#861F41] hover:bg-[#6B1934] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Create Schedule"}
        </button>
      </div>
    </form>
  );
}

export default SchedulerForm;
