import React from "react";

const visions = [
  "Personalized Learning Paths",
  "Real-Time Progress Tracking",
  "Accelerated Learning",
  "Smart Content Recommendations",
  "Seamless Integration",
];

export default function Vision() {
  return (
    <section className="py-20 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold text-black mb-12">
        Our Vision & Objectives
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {visions.map((v, i) => (
          <li
            key={i}
            className="bg-black text-white rounded-2xl shadow-lg p-6 text-lg font-medium hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-green-500"
          >
            {v}
          </li>
        ))}
      </ul>
    </section>
  );
}
