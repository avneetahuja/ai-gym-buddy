// src/components/PoseEstimation.tsx
import React, { useRef, useEffect, useState } from "react";
import usePoseDetection from "../hooks/usePoseDetection";
import Display from "./Display";

interface PoseEstimationProps {
  exercise: string;
  repCounts: number;
  onBack: () => void;
}

const PoseEstimation: React.FC<PoseEstimationProps> = ({ exercise, repCounts,onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [setComplete, setSetComplete] = useState(false);

  const { angles, stages, counts, bodyVisible, setCounts, setStages } = usePoseDetection(videoRef, canvasRef);

  useEffect(() => {
    if (videoRef.current && !cameraStarted) {
      setCameraStarted(true);
      // Logic to start the camera goes here
    }
  }, [videoRef, cameraStarted]);

  const handleReset = () => {
    setCounts({
      leftCurlCount: 0,
      rightCurlCount: 0,
      leftLateralRaiseCount: 0,
      rightLateralRaiseCount: 0,
      leftShoulderRaiseCount: 0,
      rightShoulderRaiseCount: 0,
    });
    setStages({
      leftCurlStage: "down",
      rightCurlStage: "down",
      leftLateralRaiseStage: "down",
      rightLateralRaiseStage: "down",
      leftShoulderRaiseStage: "down",
      rightShoulderRaiseStage: "down",
    });
  };
  const handleSetComplete = () => {
    console.log("Set Complete");
    setSetComplete(true);
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Display angles={angles} counts={counts} stages={stages} bodyVisible={bodyVisible} exercise={exercise} repCount={repCounts} onSetComplete={handleSetComplete}/>
      <div className="relative">
      
        <video ref={videoRef} style={{ display: "none" }}></video>
        <canvas ref={canvasRef} width={720} height={480}></canvas>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          {!setComplete && !bodyVisible && (
            <div className="absolute top-0 left-0 w-full h-full bg-red-500 bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-4xl">Body Not Visible</span>
            </div>
          )}
          {setComplete && (
            <div className="absolute top-0 left-0 w-full h-full bg-green-500 bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-4xl">Set Complete</span>
            </div>
          
          )}
        </div>
      </div>
      
      <div className="px-6 space-x-6">
      <button className="bg-red-500 text-white p-4 rounded-full px-10" onClick={handleReset}>
        Reset
      </button>
      <button className="bg-yellow-500 text-black p-4 rounded-full px-10" onClick={onBack}>
        Back
      </button>
      </div>
      
    </div>
  );
};

export default PoseEstimation;
