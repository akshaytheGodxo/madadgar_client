"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";

type Video = {
  id: string;
  title: string;
  url: string;
};

const sections: { title: string; icon: string; videos: Video[] }[] = [
  {
    title: "💻 Coding Basics",
    icon: "💻",
    videos: [
      {
        id: "coding-1",
        title: "Learn JavaScript in 12 Minutes",
        url: "https://www.youtube.com/embed/Ukg_U3CnJWI",
      },
      {
        id: "coding-2",
        title: "Python Crash Course For Beginners",
        url: "https://www.youtube.com/embed/kqtD5dpn9C8",
      },
    ],
  },
  {
    title: "🧮 Math Essentials",
    icon: "🧮",
    videos: [
      {
        id: "math-1",
        title: "Algebra Basics: What Is Algebra?",
        url: "https://www.youtube.com/embed/NybHckSEQBI",
      },
      {
        id: "math-2",
        title: "Introduction to Calculus",
        url: "https://www.youtube.com/embed/WUvTyaaNkzM",
      },
    ],
  },
  {
    title: "🌍 Science & Space",
    icon: "🌍",
    videos: [
      {
        id: "science-1",
        title: "How Big Is The Universe?",
        url: "https://www.youtube.com/embed/oy3tC9t3l44",
      },
      {
        id: "science-2",
        title: "Black Holes Explained",
        url: "https://www.youtube.com/embed/e-P5IFTqB98",
      },
    ],
  },
  {
    title: "📚 History Highlights",
    icon: "📚",
    videos: [
      {
        id: "history-1",
        title: "History of the World in 7 Minutes",
        url: "https://www.youtube.com/embed/oxEyNggZfW0",
      },
      {
        id: "history-2",
        title: "Ancient Civilizations Explained",
        url: "https://www.youtube.com/embed/RoXK0GqG9Wg",
      },
    ],
  },
  {
    title: "🗣 Communication Skills",
    icon: "🗣",
    videos: [
      {
        id: "comm-1",
        title: "How to Improve Communication Skills",
        url: "https://www.youtube.com/embed/HAnw168huqA",
      },
      {
        id: "comm-2",
        title: "Public Speaking for Beginners",
        url: "https://www.youtube.com/embed/tShavGuo0_E",
      },
    ],
  },

];

function VideoSection({
  title,
  videos,
  completed,
  markCompleted,
}: {
  title: string;
  videos: Video[];
  completed: string[];
  markCompleted: (id: string) => void;
}) {
  return (
    <div className="mb-10">
      <h1 className="font-[Metrophobic] text-3xl text-black mb-6">{title}</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {videos.map((video) => (
          <Card
            key={video.id}
            className={`shadow-lg ${completed.includes(video.id) ? "border-green-500" : ""
              }`}
          >
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <iframe
                className="rounded-lg w-full h-[300px]"
                src={video.url}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <Button
                onClick={() => markCompleted(video.id)}
                disabled={completed.includes(video.id)}
                className="w-full"
              >
                {completed.includes(video.id)
                  ? "✅ Completed"
                  : "Mark as Completed"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Drills() {
  const [completed, setCompleted] = useState<string[]>([]);

  const markCompleted = async (id: string) => {
    if (!completed.includes(id)) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return alert("You must be logged in");

        const userRef = doc(db, "users", user.uid);

        // increment currentBadges by 1
        await updateDoc(userRef, {
          currentBadges: increment(1),
        });

        setCompleted((prev) => [...prev, id]);
      } catch (err) {
        console.error("Error updating badges:", err);
      }
    }
  };

  return (
    <div className="px-6 py-10">
      {sections.map((section, i) => (
        <VideoSection
          key={i}
          title={section.title}
          videos={section.videos}
          completed={completed}
          markCompleted={markCompleted}
        />
      ))}
    </div>
  );
}
