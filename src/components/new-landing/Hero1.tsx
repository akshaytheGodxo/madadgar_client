import React from "react";

export default function Hero() {
  return (
    <section className="w-full bg-green-500 text-white py-28 px-6 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
        Revolutionizing Education Through AI
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
        Adaptive, personalized learning journeys designed to boost engagement,
        reduce study time, and empower both students and educators.
      </p>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold shadow hover:bg-gray-100 transition">
          Get Started
        </button>
        <button className="px-6 py-3 rounded-xl border border-white font-semibold text-white hover:bg-white hover:text-black transition">
          Learn More
        </button>
      </div>
    </section>
  );
}
