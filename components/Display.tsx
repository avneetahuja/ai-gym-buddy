// src/components/Display.tsx
import React from "react";

interface DisplayProps {
  angles: { [key: string]: number };
  counts: { [key: string]: number };
  stages: { [key: string]: string };
  bodyVisible: boolean;
  exercise: string;
  repCount: number;
}

const exerciseCountMap: { [key: string]: { left: string; right: string } } = {
  "Bicep Curl": { left: "leftCurlCount", right: "rightCurlCount" },
  "Shoulder Press": { left: "leftShoulderRaiseCount", right: "rightShoulderRaiseCount" },
  "Lateral Raises": { left: "leftLateralRaiseCount", right: "rightLateralRaiseCount" },
};

const Display: React.FC<DisplayProps> = ({ counts, bodyVisible, exercise, repCount }) => {
  const leftCountKey = exerciseCountMap[exercise]?.left;
  const rightCountKey = exerciseCountMap[exercise]?.right;

  return (
    <div>
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-4xl text-white">{exercise}</h1>
      </div>
      <div className="flex justify-between w-[720px] px-4 text-white">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-lg bg-yellow-500 text-black px-4">
            Left Count: {counts[leftCountKey]}/{repCount}
          </h1>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-lg bg-yellow-500 text-black px-4">
            Right Count: {counts[rightCountKey]}/{repCount}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Display;
