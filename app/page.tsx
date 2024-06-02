"use client";
import Image from "next/image";
import PoseEstimation from "../components/PoseEstimation";
import { NavBar } from "../components/NavBar";
import ExerciseForm from "@/components/ExerciseForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <NavBar />
      <div className="container mx-auto px-12">
        <ExerciseForm />
        {/* <PoseEstimation /> */}
      </div>
    </main>
  );
}
