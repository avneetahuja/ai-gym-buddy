// components/PoseEstimation.tsx
import React, { useRef, useEffect, use } from "react";
import {
  Pose,
  POSE_CONNECTIONS,
  Results,
  NormalizedLandmark,
} from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const PoseEstimation: React.FC = () => {
  const video_ref = useRef<HTMLVideoElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const canvas_ctx_ref = useRef<CanvasRenderingContext2D | null>(null);
  const [left_curl_angle, setLeftCurlAngle] = React.useState<number>(0);
  const [right_curl_angle, setRightCurlAngle] = React.useState<number>(0);
  const [left_curl_stage, setLeftCurlStage] = React.useState<string>("down");
  const [right_curl_stage, setRightCurlStage] = React.useState<string>("down");
  const [left_curl_count, setLeftCurlCount] = React.useState<number>(-1);
  const [right_curl_count, setRightCurlCount] = React.useState<number>(-1);
  const [left_lateral_raise_angle, setLeftLateralRaiseAngle] =
    React.useState<number>(0);
  const [right_lateral_raise_angle, setRightLateralRaiseAngle] =
    React.useState<number>(0);
  const [left_lateral_raise_stage, setLeftLateralRaiseStage] =
    React.useState<string>("down");
  const [right_lateral_raise_stage, setRightLateralRaiseStage] =
    React.useState<string>("down");
  const [left_lateral_raise_count, setLeftLateralRaiseCount] =
    React.useState<number>(-1);
  const [right_lateral_raise_count, setRightLateralRaiseCount] =
    React.useState<number>(-1);
    const [left_shoulder_raise_stage, setLeftShoulderRaiseStage] = React.useState<string>("down");
    const [right_shoulder_raise_stage, setRightShoulderRaiseStage] = React.useState<string>("down");
    const [left_shoulder_raise_count, setLeftShoulderRaiseCount] = React.useState<number>(0);
    const [right_shoulder_raise_count, setRightShoulderRaiseCount] = React.useState<number>(0);
    const [bodyVisible, setBodyVisible] = React.useState<boolean>(true);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.75,
    });

    pose.onResults(onResults);

    if (video_ref.current) {
      const videoElement = video_ref.current;
      const canvasElement = canvas_ref.current;
      const canvasCtx = canvasElement?.getContext("2d");
      if (canvasCtx) canvas_ctx_ref.current = canvasCtx;

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await pose.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
      });

      camera.start();
    }

    return () => {
      pose.close();
    };
  }, []);
  const calculateAngle = (
    a: NormalizedLandmark,
    b: NormalizedLandmark,
    c: NormalizedLandmark
  ) => {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    // Ensure the angle is within the range [0, 180]
    if (angle > 180) {
      angle = 360 - angle;
    }

    return angle;
  };

  const onResults = (results: Results) => {
    const canvasCtx = canvas_ctx_ref.current;
    const canvasElement = canvas_ref.current;

    if (canvasCtx && canvasElement) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00F",
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#F00",
        lineWidth: 2,
      });
      if (results.poseLandmarks) {
        const left_shoulder = results.poseLandmarks[11];
        const left_elbow = results.poseLandmarks[13];
        const left_wrist = results.poseLandmarks[15];
        const right_shoulder = results.poseLandmarks[12];
        const right_elbow = results.poseLandmarks[14];
        const right_wrist = results.poseLandmarks[16];
        const left_hip = results.poseLandmarks[23];
        const right_hip = results.poseLandmarks[24];

        if (
            left_shoulder &&
            left_elbow &&
            left_wrist &&
            right_shoulder &&
            right_elbow &&
            right_wrist &&
            left_hip &&
            right_hip &&
            left_shoulder.visibility > 0.5 &&
            left_elbow.visibility > 0.5 &&
            left_wrist.visibility > 0.5 &&
            right_shoulder.visibility > 0.5 &&
            right_elbow.visibility > 0.5 &&
            right_wrist.visibility > 0.5 &&
            left_hip.visibility > 0.5 &&
            right_hip.visibility > 0.5
          )
          {
            setLeftCurlAngle(calculateAngle(left_shoulder, left_elbow, left_wrist));
            setRightCurlAngle(
              calculateAngle(right_shoulder, right_elbow, right_wrist)
            );
            setLeftLateralRaiseAngle(
              calculateAngle(left_hip, left_shoulder, left_elbow)
            );
            setRightLateralRaiseAngle(
              calculateAngle(right_hip, right_shoulder, right_elbow)
            );
            setBodyVisible(true);
          }
          else{
            setLeftCurlAngle(0);
            setRightCurlAngle(0);
            setLeftLateralRaiseAngle(0);
            setRightLateralRaiseAngle(0);
            setLeftCurlStage("down");
            setRightCurlStage("down");
            setLeftLateralRaiseStage("down");
            setRightLateralRaiseStage("down");
            setLeftShoulderRaiseStage("down");
            setRightShoulderRaiseStage("down");
            setBodyVisible(false);
          }
        
      }
      else{
        setBodyVisible(false);
      }
      canvasCtx.restore();
    }
  };

  useEffect(() => {
    if (bodyVisible && left_curl_angle > 170) {
      setLeftCurlStage("down");
    }
  }, [left_curl_angle]);
  useEffect(() => {
    if (bodyVisible && left_curl_angle < 90 && left_curl_stage === "down") {
      setLeftCurlStage("up");
      setLeftCurlCount(left_curl_count + 1);
    }
  }, [left_curl_angle]);
  useEffect(() => {
    if (bodyVisible && right_curl_angle > 170) {
      setRightCurlStage("down");
    }
  }, [right_curl_angle]);
  useEffect(() => {
    if (bodyVisible && right_curl_angle < 90 && right_curl_stage === "down") {
      setRightCurlStage("up");
      setRightCurlCount(right_curl_count + 1);
    }
  }, [right_curl_angle]);
  useEffect(() => {
    if (bodyVisible && left_lateral_raise_angle < 20) {
      setLeftLateralRaiseStage("down");
    }
  }, [left_lateral_raise_angle]);
  useEffect(() => {
    if (bodyVisible && left_lateral_raise_angle > 65 && left_lateral_raise_stage === "down") {
        
      setLeftLateralRaiseStage("up");
      setLeftLateralRaiseCount(left_lateral_raise_count + 1);
    }
  }, [left_lateral_raise_angle]);
  useEffect(() => {
    if (bodyVisible && right_lateral_raise_angle < 20) {
      setRightLateralRaiseStage("down");
    }
  }, [right_lateral_raise_angle]);
  useEffect(() => {
    if (
        bodyVisible &&
      right_lateral_raise_angle > 65 &&
      right_lateral_raise_stage === "down"
    ) {
      setRightLateralRaiseStage("up");
      setRightLateralRaiseCount(right_lateral_raise_count + 1);
    }
  }, [right_lateral_raise_angle]);
  useEffect(() => {
    if (bodyVisible && left_curl_angle>160 && left_lateral_raise_angle>160 && left_shoulder_raise_stage==="down"){
      setLeftShoulderRaiseStage("up");
      setLeftShoulderRaiseCount(left_shoulder_raise_count+1)
    }
    else if(bodyVisible && left_curl_angle<160 || left_lateral_raise_angle<160){
        setLeftShoulderRaiseStage("down");
    }
    if(bodyVisible && right_curl_angle>160 && right_lateral_raise_angle>160 && right_shoulder_raise_stage==="down"){
      setRightShoulderRaiseStage("up");
      setRightShoulderRaiseCount(right_shoulder_raise_count+1)
    }
    else if(bodyVisible && right_curl_angle<160 || right_lateral_raise_angle<160){
        setRightShoulderRaiseStage("down");
    }
  },[left_curl_angle, right_curl_angle, left_lateral_raise_angle, right_lateral_raise_angle]);

  const handleReset = () => {
    setLeftCurlCount(0);
    setRightCurlCount(0);
    setLeftLateralRaiseCount(0);
    setRightLateralRaiseCount(0);
    setLeftShoulderRaiseCount(0);
    setRightShoulderRaiseCount(0);
  };

  return (
    <div className="flex">
      <video ref={video_ref} style={{ display: "none" }}></video>
      <canvas ref={canvas_ref} width={1280} height={720}></canvas>
      <div>
        {bodyVisible ? (
            <div>
                <h1>Left Angle: {left_curl_angle.toFixed(2)}</h1>
        <h1>Right Angle: {right_curl_angle.toFixed(2)}</h1>
        <h1>Left Count: {left_curl_count}</h1>
        <h1>Right Count: {right_curl_count}</h1>
        <h1>Left Stage: {left_curl_stage}</h1>
        <h1>Right Stage: {right_curl_stage}</h1>

        <h1>Left Lateral Raise Angle: {left_lateral_raise_angle.toFixed(2)}</h1>
        <h1>
          Right Lateral Raise Angle: {right_lateral_raise_angle.toFixed(2)}
        </h1>
        <h1>Left Lateral Raise Count: {left_lateral_raise_count}</h1>
        <h1>Right Lateral Raise Count: {right_lateral_raise_count}</h1>
        <h1>Left Lateral Raise Stage: {left_lateral_raise_stage}</h1>
        <h1>Right Lateral Raise Stage: {right_lateral_raise_stage}</h1>
        <h1>Left Shoulder Raise Count: {left_shoulder_raise_count}</h1>
        <h1>Right Shoulder Raise Count: {right_shoulder_raise_count}</h1>
        <h1>Left Shoulder Raise Stage: {left_shoulder_raise_stage}</h1>
        <h1>Right Shoulder Raise Stage: {right_shoulder_raise_stage}</h1>
        <button className="bg-red-500 p-8" onClick={handleReset}>
          Reset
        </button>
                </div> ) : (
            <div>
                <h1>Body Not Visible</h1>
                </div>
                )}
        
      </div>
    </div>
  );
};

export default PoseEstimation;
