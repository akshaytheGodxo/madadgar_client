"use client";

import { Button } from "@/components/ui/button";

export default function Hero1() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-black text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-green-500">Madadgar</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          A digital platform revolutionizing disaster preparedness in Indian schools and colleges.  
          Learn safety through AI-powered gamification and real-time personalization.
        </p>

        <div className="flex justify-center gap-4">
          <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-xl">
            Get Started
          </Button>
          <Button
            variant="outline"
            className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold px-6 py-3 rounded-xl"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
