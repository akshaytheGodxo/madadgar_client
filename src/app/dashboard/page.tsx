"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Home from "./akshansh_to_do/home";
import Drills from "./akshansh_to_do/drills";
import ChooseOrg from "./akshansh_to_do/choose_org";
import Pending from "./akshansh_to_do/Pending";
import Games from "./akshansh_to_do/games";
import TrackStudents from "./akshansh_to_do/track_students";



export default function Dashboard() {
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");
    return (
        <div className=" w-full h-screen p-6 bg-gray-50">
            {tab === "home" && (<Home />)}
            {tab === "drills" && (<Drills />)}
            {tab === "games" && (<Games />)}
            {tab === "connect"}
            {tab === "settings"}
            {tab === "choose_org" && (<ChooseOrg />)}
            {tab === "pending" && (<Pending />)}
            {tab === "track_students" && (<TrackStudents />)}

            <iframe
                src="/chatBot/index.html"
                className="fixed bottom-4 right-4 w-[400px] h-[500px] "
            ></iframe>
        </div>
    );
}
