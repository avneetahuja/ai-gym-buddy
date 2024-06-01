import React from "react";

interface DisplayProps {
  angles: { [key: string]: number };
  counts: { [key: string]: number };
  stages: { [key: string]: string };
  bodyVisible: boolean;
}

const Display: React.FC<DisplayProps> = ({ angles, counts, stages, bodyVisible }) => {
  return (
    <div>
      {bodyVisible ? (
        <div>
          <h1>Left Angle: {angles.leftCurlAngle.toFixed(2)}</h1>
          <h1>Right Angle: {angles.rightCurlAngle.toFixed(2)}</h1>
          <h1>Left Count: {counts.leftCurlCount}</h1>
          <h1>Right Count: {counts.rightCurlCount}</h1>
          <h1>Left Stage: {stages.leftCurlStage}</h1>
          <h1>Right Stage: {stages.rightCurlStage}</h1>
          <h1>Left Lateral Raise Angle: {angles.leftLateralRaiseAngle.toFixed(2)}</h1>
          <h1>Right Lateral Raise Angle: {angles.rightLateralRaiseAngle.toFixed(2)}</h1>
          <h1>Left Lateral Raise Count: {counts.leftLateralRaiseCount}</h1>
          <h1>Right Lateral Raise Count: {counts.rightLateralRaiseCount}</h1>
          <h1>Left Lateral Raise Stage: {stages.leftLateralRaiseStage}</h1>
          <h1>Right Lateral Raise Stage: {stages.rightLateralRaiseStage}</h1>
          <h1>Left Shoulder Raise Count: {counts.leftShoulderRaiseCount}</h1>
          <h1>Right Shoulder Raise Count: {counts.rightShoulderRaiseCount}</h1>
          <h1>Left Shoulder Raise Stage: {stages.leftShoulderRaiseStage}</h1>
          <h1>Right Shoulder Raise Stage: {stages.rightShoulderRaiseStage}</h1>
        </div>
      ) : (
        <div>
          <h1>Body Not Visible</h1>
        </div>
      )}
    </div>
  );
};

export default Display;
