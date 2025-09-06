import React from "react";

const features = [
  "Adaptive AI Engine",
  "Live Progress Tracking",
  "Gamified Experience",
  "AI-powered Quiz Generation",
  "Multi-device Synchronization",
  "Comprehensive Teacher Dashboards",
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-12">
        Revolutionary Platform Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-gray-200 rounded-2xl shadow p-6 text-gray-800 font-medium hover:shadow-lg transition"
          >
            {f}
          </div>
        ))}
      </div>
    </section>
  );
}
