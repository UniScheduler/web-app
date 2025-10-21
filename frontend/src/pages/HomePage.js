import React from "react";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  ClockIcon,
  SparklesIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const HomePage = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Scheduling",
      description:
        "Advanced AI algorithms create optimal VT course schedules while avoiding conflicts and respecting your preferences.",
    },
    {
      icon: ClockIcon,
      title: "Conflict Detection",
      description:
        "Automatically detects and prevents scheduling conflicts for Virginia Tech courses, ensuring a seamless academic experience.",
    },
    {
      icon: UserGroupIcon,
      title: "Professor Preferences",
      description:
        "Specify your preferred VT professors and let our system prioritize them in your schedule.",
    },
    {
      icon: CheckCircleIcon,
      title: "Real-time Validation",
      description:
        "Instant validation ensures all Virginia Tech schedules are conflict-free and meet your requirements.",
    },
  ];

  const stats = [
    { number: "1,000+", label: "Schedule Combinations" },
    { number: "500+", label: "Courses Supported" },
    { number: "99.9%", label: "Conflict-Free Rate" },
    { number: "24/7", label: "Availability" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#861F41] via-[#A52A2A] to-[#8B0000] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <AcademicCapIcon className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Virginia Tech Course
              <span className="block text-[#E5751F] mt-2">
                Scheduling Made Simple
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
              Create optimal class schedules with AI-powered conflict detection
              and preference optimization. Save time and focus on what matters
              most - your VT education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/scheduler"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#E5751F] hover:bg-[#D46A1C] text-white font-semibold rounded-xl transition-all duration-200 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Your VT Schedule
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose UniScheduler for Virginia Tech?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our intelligent platform takes the stress out of course scheduling
              with advanced features designed specifically for Hokies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-8 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#861F41] text-white rounded-xl mb-4 sm:mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#861F41] dark:text-[#E5751F] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-[#861F41] to-[#8B0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Perfect Virginia Tech Schedule?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-200 max-w-2xl mx-auto">
            Join hundreds of Virginia Tech students who have already optimized
            their course schedules with UniScheduler.
          </p>
          <Link
            to="/scheduler"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#E5751F] hover:bg-[#D46A1C] text-white font-semibold rounded-xl transition-all duration-200 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Started Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
