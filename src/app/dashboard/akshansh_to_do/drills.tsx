"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Video = {
  id: string;
  title: string;
  url: string;
};

const sections: { title: string; icon: string; videos: Video[] }[] = [
  {
    title: "⚡ Lightning Drills",
    icon: "⚡",
    videos: [
      {
        id: "lightning-1",
        title: "How to Survive a Lightning Strike",
        url: "https://www.youtube.com/embed/eNxDgd3D_bU",
      },
      {
        id: "lightning-2",
        title: "What Happens If You're Struck By Lightning?",
        url: "https://www.youtube.com/embed/I_b1NLoY1mo",
      },
    ],
  },
  {
    title: "🌊 Tsunami Drills",
    icon: "🌊",
    videos: [
      {
        id: "tsunami-1",
        title: "How to Prepare in Case of a Tsunami | Disasters",
        url: "https://www.youtube.com/embed/m7EDddq9ftQ",
      },
      {
        id: "tsunami-2",
        title:
          "How To Survive Floods? | Preparing For A Flood | The Dr Binocs Show | Peekaboo Kidz",
        url: "https://www.youtube.com/embed/pi_nUPcQz_A",
      },
    ],
  },
  {
    title: "🏙 Urban Flood Drills",
    icon: "🏙",
    videos: [
      {
        id: "flood-1",
        title:
          "Urban Flooding in India - Five ways to stop flooding in Indian cities",
        url: "https://www.youtube.com/embed/An2GJVw-cOU",
      },
      {
        id: "flood-2",
        title: "Urban flooding - causes and solutions",
        url: "https://www.youtube.com/embed/UFh67-T_GnM",
      },
    ],
  },
  {
    title: "🌀 Cyclone Drills",
    icon: "🌀",
    videos: [
      {
        id: "cyclone-1",
        title: "Class VII - Cyclone and Safety measures",
        url: "https://www.youtube.com/embed/XK2pKDzNcHE",
      },
      {
        id: "cyclone-2",
        title:
          "CYCLONE NISARGA - Precautions | What to do before Cyclone Nisarga",
        url: "https://www.youtube.com/embed/t_x-5o_EWXE",
      },
    ],
  },
  {
    title: "❄ Cold Wave Drills",
    icon: "❄",
    videos: [
      {
        id: "cold-1",
        title:
          "(Hindi) Safety Measures To Be Taken During Winter (Cold Waves)!",
        url: "https://www.youtube.com/embed/waBJZ-z_xp4",
      },
      {
        id: "cold-2",
        title: "Cold wave Impact and its precautions",
        url: "https://www.youtube.com/embed/X8IKETOdJTA",
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
            className={`shadow-lg ${
              completed.includes(video.id) ? "border-green-500" : ""
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
                {completed.includes(video.id) ? "✅ Completed" : "Mark as Completed"}
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

  const markCompleted = (id: string) => {
    if (!completed.includes(id)) {
      setCompleted((prev) => [...prev, id]);
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
