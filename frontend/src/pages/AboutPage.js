import React from "react";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const AboutPage = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Optimization",
      description:
        "Our advanced AI algorithms analyze thousands of possible Virginia Tech schedule combinations to find the optimal solution that meets your preferences and avoids conflicts.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Conflict-Free Guarantee",
      description:
        "Every generated Virginia Tech schedule is guaranteed to be conflict-free with proper time buffers between classes and no overlapping commitments.",
    },
    {
      icon: ClockIcon,
      title: "Real-Time Processing",
      description:
        "Get your optimized Virginia Tech schedule in seconds with our efficient real-time processing system that fetches live VT course data.",
    },
    {
      icon: UserGroupIcon,
      title: "Professor Preferences",
      description:
        "Specify your preferred Virginia Tech professors and let our system prioritize them when creating your schedule.",
    },
    {
      icon: ChartBarIcon,
      title: "Smart Analytics",
      description:
        "View detailed analytics about your Virginia Tech schedule including time distribution, location optimization, and workload balance.",
    },
    {
      icon: AcademicCapIcon,
      title: "VT Academic Focus",
      description:
        "Built specifically for Virginia Tech students with VT academic requirements in mind, supporting complex course structures and prerequisites.",
    },
  ];

  const stats = [
    {
      number: "1,000+",
      label: "VT Schedules Generated",
      description: "Virginia Tech students trust our platform",
    },
    {
      number: "500+",
      label: "VT Courses Supported",
      description: "Comprehensive Virginia Tech course database",
    },
    {
      number: "99.9%",
      label: "Success Rate",
      description: "Reliable VT conflict detection",
    },
    {
      number: "< 30s",
      label: "Average Generation Time",
      description: "Lightning fast results for VT schedules",
    },
  ];

  const team = [
    {
      name: "Laksh Bharani",
      role: "Lead Developer & Creator",
      description:
        "Virginia Tech student focused on creating intuitive and powerful scheduling solutions for the VT community.",
    },
    {
      name: "Anjan Bellamkonda",
      role: "Co-Creator & Developer",
      description:
        "Virginia Tech student specializing in AI algorithms and constraint satisfaction for optimal VT schedule generation.",
    },
    {
      name: "Virginia Tech Community",
      role: "Academic Expertise",
      description:
        "Built with feedback from VT students and academic professionals to meet real Virginia Tech needs and requirements.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#861F41] via-[#A52A2A] to-[#8B0000] text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <AcademicCapIcon className="h-20 w-20 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About UniScheduler
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
            Revolutionizing Virginia Tech course scheduling with AI-powered
            optimization and intelligent conflict detection.
          </p>
          <Link
            to="/scheduler"
            className="inline-flex items-center px-8 py-4 bg-[#E5751F] hover:bg-[#D46A1C] text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
          >
            Try It Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              We believe that every Virginia Tech student deserves a stress-free
              course registration experience. UniScheduler was created by VT
              students, for VT students, to eliminate the frustration of manual
              schedule planning and provide Hokies with optimal, conflict-free
              schedules that align with their preferences and academic goals.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose UniScheduler for Virginia Tech?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly
              design to deliver the best Virginia Tech scheduling experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#861F41] text-white rounded-lg mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#861F41] dark:text-[#E5751F] mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Created by Virginia Tech Students
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Dedicated Hokies working together to create the best scheduling
              experience for the Virginia Tech community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-[#861F41] dark:text-[#E5751F] font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Built with modern technologies to ensure reliability, performance,
              and scalability for Virginia Tech students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "React",
                description: "Modern frontend framework for responsive UI",
              },
              {
                name: "Python Flask",
                description: "Robust backend API with AI integration",
              },
              {
                name: "Google Gemini AI",
                description: "Advanced AI for VT schedule optimization",
              },
              {
                name: "Tailwind CSS",
                description: "Utility-first CSS for beautiful design",
              },
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {tech.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#861F41] to-[#8B0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Future of Virginia Tech Course Scheduling?
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Join hundreds of Virginia Tech students who have already optimized
            their academic schedules with UniScheduler.
          </p>
          <Link
            to="/scheduler"
            className="inline-flex items-center px-8 py-4 bg-[#E5751F] hover:bg-[#D46A1C] text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
          >
            Get Started Today
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
