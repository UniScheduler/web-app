import React, { useState } from "react";
import axios from "axios";
import CalendarView from "./CalendarView";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Get API host from environment variable or use default
const API_HOST =
  process.env.REACT_APP_API_HOST || "https://unischeduler.onrender.com";

function ScheduleViewer({ schedule }) {
  const [downloadMessage, setDownloadMessage] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'calendar'
  const [crnColors, setCrnColors] = useState({});

  React.useEffect(() => {
    if (!schedule || !schedule.classes) return;

    const colors = [
      "#FECACA",
      "#BFDBFE",
      "#BBF7D0",
      "#FEF08A",
      "#E9D5FF",
      "#FBCFE8",
      "#C7D2FE",
      "#99F6E4",
      "#FED7AA",
      "#A5F3FC",
      "#D9F99D",
      "#FDE68A",
      "#A7F3D0",
      "#DDD6FE",
      "#F5D0FE",
    ];

    const crnColorMap = {};
    schedule.classes.forEach((cls, index) => {
      if (!crnColorMap[cls.crn]) {
        crnColorMap[cls.crn] = colors[index % colors.length];
      }
    });

    setCrnColors(crnColorMap);
  }, [schedule]);

  const handleDownloadSchedule = async () => {
    try {
      setDownloadMessage("Preparing download...");

      // Validate schedule data
      if (!schedule || !schedule.classes || schedule.classes.length === 0) {
        setDownloadMessage("Error: No schedule data to download");
        return;
      }

      // Convert color hex values to RGB format for matplotlib
      const colorMapping = {};
      Object.keys(crnColors).forEach((crn) => {
        const hex = crnColors[crn].replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        colorMapping[crn] = [r, g, b];
      });

      const response = await axios.post(
        `${API_HOST}/api/downloadSchedule`,
        {
          schedule,
          crnColors: colorMapping,
        },
        {
          responseType: "blob",
          timeout: 15000, // 15 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "schedule.pdf"; // or .csv / .xlsx as per your backend
      link.click();

      setDownloadMessage("Download started.");
    } catch (err) {
      setDownloadMessage("Failed to download schedule.");
    }
  };

  return (
    <div className="mt-5 bg-white p-5 border border-gray-300 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center">Your Schedule</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded ${
              viewMode === "table"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded ${
              viewMode === "calendar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={handleDownloadSchedule}
            className="w-10 h-10 flex items-center justify-center bg-[#861F41] hover:bg-[#6B1934] text-white rounded-md shadow-md transition-colors"
            title="Download Schedule"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left bg-gray-100">
                  CRN
                </th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100">
                  Course
                </th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100">
                  Course Name
                </th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100">
                  Instructor
                </th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100">
                  Time &amp; Days
                </th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.classes && schedule.classes.length > 0 ? (
                schedule.classes.map((cls, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{cls.crn}</td>
                    <td className="border border-gray-300 p-2">
                      {cls.courseNumber}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {cls.courseName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {cls.professorName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {cls.time} on {cls.days}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {cls.location}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-2.5">
                    No classes scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <CalendarView schedule={schedule} setCrnColors={setCrnColors} />
          </div>

          {/* Online Courses Section */}
          {schedule.classes &&
            schedule.classes.some((cls) =>
              cls.location.toLowerCase().includes("online")
            ) && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-base font-medium text-blue-800 mb-2">
                  Other Courses
                </h3>
                <div className="space-y-2">
                  {schedule.classes
                    .filter((cls) =>
                      cls.location.toLowerCase().includes("online")
                    )
                    .filter(
                      (cls, index, self) =>
                        index === self.findIndex((c) => c.crn === cls.crn)
                    )
                    .map((cls, index) => (
                      <div
                        key={index}
                        className="bg-white p-2 rounded shadow-sm border border-blue-100"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-blue-900">
                            {cls.courseNumber}
                          </h4>
                          <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                            Online
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Instructor:</span>{" "}
                            {cls.professorName}
                          </div>
                          <div>
                            <span className="font-medium">Schedule:</span>{" "}
                            {cls.time} on {cls.days}
                          </div>
                          <div>
                            <span className="font-medium">CRN:</span> {cls.crn}
                          </div>
                          <div>
                            <span className="font-medium">Platform:</span>{" "}
                            {cls.location}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default ScheduleViewer;
