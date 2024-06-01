import React, { useRef } from "react";
import usePoseDetection from "../hooks/usePoseDetection";
import Display from "./Display";

const PoseEstimation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { angles, stages, counts, bodyVisible, setCounts, setStages } = usePoseDetection(videoRef, canvasRef);

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

  return (
    <div className="flex">
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} width={1280} height={720}></canvas>
      <Display angles={angles} counts={counts} stages={stages} bodyVisible={bodyVisible} />
      <button className="bg-red-500 p-8" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default PoseEstimation;
