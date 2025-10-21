import React, { useState } from "react";
import CalendarView from "./CalendarView";
import { ArrowDownTrayIcon, CheckIcon } from "@heroicons/react/24/outline";

// Get API host from environment variable or use default
const API_HOST =
  process.env.REACT_APP_API_HOST || "https://unischeduler.onrender.com";

function MultipleScheduleViewer({ courses, preferences, termYear, email }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [error, setError] = useState("");
  const [crnColors, setCrnColors] = useState({});

  const generateMultipleSchedules = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_HOST}/api/generate_multiple_schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courses,
            preferences,
            term_year: termYear,
            email: email || undefined,
            num_options: 5,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.schedules) {
        setSchedules(data.schedules);
        if (data.schedules.length > 0) {
          setSelectedSchedule(data.schedules[0]);
        }
      } else {
        setError("Failed to generate multiple schedules");
      }
    } catch (err) {
      console.error("Error generating multiple schedules:", err);
      setError("Failed to generate multiple schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const getScheduleSummary = (schedule) => {
    if (!schedule || !schedule.classes) return {};

    const dailyClasses = { M: 0, T: 0, W: 0, R: 0, F: 0 };
    let totalClasses = 0;
    let morningClasses = 0;
    let afternoonClasses = 0;
    let eveningClasses = 0;

    schedule.classes.forEach((cls) => {
      totalClasses++;
      cls.days.split("").forEach((day) => {
        if (dailyClasses.hasOwnProperty(day)) {
          dailyClasses[day]++;
        }
      });

      // Analyze time distribution
      const timeStr = cls.time.split(" - ")[0];
      const hour = parseInt(timeStr.split(":")[0]);
      const isPM = timeStr.includes("PM");
      const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour;

      if (adjustedHour < 12) morningClasses++;
      else if (adjustedHour < 17) afternoonClasses++;
      else eveningClasses++;
    });

    return {
      totalClasses,
      dailyClasses,
      morningClasses,
      afternoonClasses,
      eveningClasses,
      score: schedule.score,
    };
  };

  const getScoreColor = (score) => {
    if (score >= 1200) return "text-green-600 bg-green-100";
    if (score >= 1100) return "text-blue-600 bg-blue-100";
    if (score >= 1000) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="mt-5 bg-white p-5 border border-gray-300 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center">Multiple Schedule Options</h2>
        <button
          onClick={generateMultipleSchedules}
          disabled={loading}
          className="text-sm bg-[#861F41] hover:bg-[#6B1934] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Options"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {schedules.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule Options List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Available Options
            </h3>
            {schedules.map((schedule, index) => {
              const summary = getScheduleSummary(schedule);
              const isSelected =
                selectedSchedule && selectedSchedule.id === schedule.id;

              return (
                <div
                  key={schedule.id}
                  onClick={() => handleScheduleSelect(schedule)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#861F41] bg-[#861F41]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">
                      Option {schedule.id}
                      {isSelected && (
                        <CheckIcon className="inline ml-2 h-4 w-4 text-[#861F41]" />
                      )}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(
                        summary.score
                      )}`}
                    >
                      Score: {summary.score}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>Total Classes: {summary.totalClasses}</div>
                    <div>Morning: {summary.morningClasses}</div>
                    <div>Afternoon: {summary.afternoonClasses}</div>
                    <div>Evening: {summary.eveningClasses}</div>
                  </div>

                  <div className="mt-2 flex gap-1">
                    {Object.entries(summary.dailyClasses).map(
                      ([day, count]) => (
                        <div
                          key={day}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {day}: {count}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Schedule Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Selected Schedule
            </h3>
            {selectedSchedule ? (
              <div>
                <div className="mb-4">
                  <CalendarView
                    schedule={selectedSchedule}
                    setCrnColors={setCrnColors}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2 text-left bg-gray-100">
                          Course
                        </th>
                        <th className="border border-gray-300 p-2 text-left bg-gray-100">
                          Time & Days
                        </th>
                        <th className="border border-gray-300 p-2 text-left bg-gray-100">
                          Location
                        </th>
                        <th className="border border-gray-300 p-2 text-left bg-gray-100">
                          Professor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSchedule.classes.map((cls, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">
                            {cls.courseNumber}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {cls.time} on {cls.days}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {cls.location}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {cls.professorName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Select a schedule option to view details
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && schedules.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Generate Options" to create multiple schedule alternatives
        </div>
      )}
    </div>
  );
}

export default MultipleScheduleViewer;
