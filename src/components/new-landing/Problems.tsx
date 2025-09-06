import React from "react";
import { AlertTriangle, UserX, Frown, BarChart2 } from "lucide-react";

const problems = [
  {
    title: "Generic Learning",
    desc: "Existing e-learning platforms deliver one-size-fits-all content, ignoring individual learning styles and pace differences.",
    icon: <AlertTriangle className="w-8 h-8 text-green-500" />,
  },
  {
    title: "Lack of Personalization",
    desc: "Students struggle without customized learning paths, leading to knowledge gaps and inefficient study time.",
    icon: <UserX className="w-8 h-8 text-green-500" />,
  },
  {
    title: "Engagement Crisis",
    desc: "Monotonous learning experiences cause declining motivation and higher dropout rates across educational platforms.",
    icon: <Frown className="w-8 h-8 text-green-500" />,
  },
  {
    title: "Limited Analytics",
    desc: "Educators and students lack actionable insights, making it difficult to track progress and improve outcomes.",
    icon: <BarChart2 className="w-8 h-8 text-green-500" />,
  },
];

export default function Problems() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-20 px-6 bg-white">
      <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-12 text-center">
        The Problem We&apos;re Solving
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {problems.map((p, i) => (
          <div
            key={i}
            className="bg-black text-white shadow-lg rounded-2xl p-6 flex flex-col items-start gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            {p.icon}
            <h3 className="text-2xl font-semibold">{p.title}</h3>
            <p className="text-white/80 text-lg">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
