"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Home from "./akshansh_to_do/home";
import Drills from "./akshansh_to_do/drills";
export default function Dashboard() {
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");
    return (
        <div className="flex flex-col w-full h-screen p-6 bg-gray-50">
            {tab === "home" && (<Home />)}
            {tab === "drills" && (<Drills />)}
            {tab === "games"}
            {tab === "connect"}
            {tab === "settings"}
        </div>
    );
}
