import React from "react";

const steps = [
  "Data Collection",
  "AI Processing",
  "Content Delivery",
  "Assessment",
  "Profile Update",
];

export default function Workflow() {
  return (
    <section className="py-20 px-6 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-12">
        Intelligent Learning Workflow
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 bg-white shadow rounded-2xl px-6 py-8 w-48"
          >
            <span className="text-3xl font-bold text-indigo-600">{i + 1}</span>
            <p className="text-gray-700 font-medium">{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
