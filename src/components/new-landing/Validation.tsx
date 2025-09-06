import React from "react";

const validations = [
  "Competitive Benchmarking – Coursera, Byju’s, Khan Academy, Duolingo",
  "Performance Metrics – Accuracy, Progress, Engagement",
  "User Validation – Student & Teacher feedback surveys",
  "A/B Testing – Static vs AI-driven learning outcomes",
];

export default function Validation() {
  return (
    <section className="py-20 px-6 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-12">
        Comprehensive Research & Validation
      </h2>
      <ul className="space-y-6 max-w-3xl mx-auto text-lg text-gray-700">
        {validations.map((v, i) => (
          <li
            key={i}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            {v}
          </li>
        ))}
      </ul>
    </section>
  );
}
