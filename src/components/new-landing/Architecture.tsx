import React from "react";

const layers = [
  "Frontend Layer – HTML5, CSS3, JS",
  "Backend Framework – Django REST",
  "AI Engine – Neural Networks + Collaborative Filtering",
  "Data Management – PostgreSQL Database",
];

export default function Architecture() {
  return (
    <section className="py-20 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-12">
        Robust Technical Architecture
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {layers.map((l, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-gray-200 rounded-2xl p-6 text-gray-700 font-medium shadow"
          >
            {l}
          </div>
        ))}
      </div>
    </section>
  );
}
