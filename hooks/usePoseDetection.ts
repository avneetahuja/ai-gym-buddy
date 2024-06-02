import { useEffect, useRef, useState } from "react";
import {
  Pose,
  Results,
  NormalizedLandmark,
  POSE_CONNECTIONS,
} from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const usePoseDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [angles, setAngles] = useState({
    leftCurlAngle: 0,
    rightCurlAngle: 0,
    leftLateralRaiseAngle: 0,
    rightLateralRaiseAngle: 0,
  });
  const [stages, setStages] = useState({
    leftCurlStage: "down",
    rightCurlStage: "down",
    leftLateralRaiseStage: "down",
    rightLateralRaiseStage: "down",
    leftShoulderRaiseStage: "down",
    rightShoulderRaiseStage: "down",
  });
  const [counts, setCounts] = useState({
    leftCurlCount: 0,
    rightCurlCount: 0,
    leftLateralRaiseCount: 0,
    rightLateralRaiseCount: 0,
    leftShoulderRaiseCount: 0,
    rightShoulderRaiseCount: 0,
  });
  const [bodyVisible, setBodyVisible] = useState<boolean>(false);

  const calculateAngle = (
    a: NormalizedLandmark,
    b: NormalizedLandmark,
    c: NormalizedLandmark
  ) => {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  const onResults = (results: Results) => {
    const canvasCtx = canvasCtxRef.current;
    const canvasElement = canvasRef.current;

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
        const [
          leftShoulder,
          leftElbow,
          leftWrist,
          rightShoulder,
          rightElbow,
          rightWrist,
          leftHip,
          rightHip,
        ] = [
          results.poseLandmarks[11],
          results.poseLandmarks[13],
          results.poseLandmarks[15],
          results.poseLandmarks[12],
          results.poseLandmarks[14],
          results.poseLandmarks[16],
          results.poseLandmarks[23],
          results.poseLandmarks[24],
        ];

        if (
          [
            leftShoulder,
            leftElbow,
            leftWrist,
            rightShoulder,
            rightElbow,
            rightWrist,
            leftHip,
            rightHip,
          ].every((landmark) => landmark && (landmark.visibility ?? 0) > 0.5)
        ) {
          setAngles({
            leftCurlAngle: calculateAngle(leftShoulder, leftElbow, leftWrist),
            rightCurlAngle: calculateAngle(
              rightShoulder,
              rightElbow,
              rightWrist
            ),
            leftLateralRaiseAngle: calculateAngle(
              leftHip,
              leftShoulder,
              leftElbow
            ),
            rightLateralRaiseAngle: calculateAngle(
              rightHip,
              rightShoulder,
              rightElbow
            ),
          });
          setBodyVisible(true);
        } else {
          setAngles({
            leftCurlAngle: 0,
            rightCurlAngle: 0,
            leftLateralRaiseAngle: 0,
            rightLateralRaiseAngle: 0,
          });
          setStages({
            leftCurlStage: "down",
            rightCurlStage: "down",
            leftLateralRaiseStage: "down",
            rightLateralRaiseStage: "down",
            leftShoulderRaiseStage: "down",
            rightShoulderRaiseStage: "down",
          });
          setBodyVisible(false);
        }
      } else {
        setBodyVisible(false);
      }
      canvasCtx.restore();
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

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

    if (videoRef.current) {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement?.getContext("2d");
      if (canvasCtx) canvasCtxRef.current = canvasCtx;

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await pose.send({ image: videoElement });
        },
        width: isMobile ? 360 : 1280,
        height: isMobile ? 640 : 720,
      });

      camera.start();
    }

    return () => {
      pose.close();
    };
  }, [videoRef, canvasRef]);

  useEffect(() => {
    if (bodyVisible && angles.leftCurlAngle > 170) {
      setStages((prev) => ({ ...prev, leftCurlStage: "down" }));
    }
  }, [angles.leftCurlAngle, bodyVisible]);

  useEffect(() => {
    if (
      bodyVisible &&
      angles.leftCurlAngle < 90 &&
      stages.leftCurlStage === "down"
    ) {
      setStages((prev) => ({ ...prev, leftCurlStage: "up" }));
      setCounts((prev) => ({ ...prev, leftCurlCount: prev.leftCurlCount + 1 }));
    }
  }, [angles.leftCurlAngle, stages.leftCurlStage, bodyVisible]);

  useEffect(() => {
    if (bodyVisible && angles.rightCurlAngle > 170) {
      setStages((prev) => ({ ...prev, rightCurlStage: "down" }));
    }
  }, [angles.rightCurlAngle, bodyVisible]);

  useEffect(() => {
    if (
      bodyVisible &&
      angles.rightCurlAngle < 90 &&
      stages.rightCurlStage === "down"
    ) {
      setStages((prev) => ({ ...prev, rightCurlStage: "up" }));
      setCounts((prev) => ({
        ...prev,
        rightCurlCount: prev.rightCurlCount + 1,
      }));
    }
  }, [angles.rightCurlAngle, stages.rightCurlStage, bodyVisible]);

  useEffect(() => {
    if (bodyVisible && angles.leftLateralRaiseAngle < 20) {
      setStages((prev) => ({ ...prev, leftLateralRaiseStage: "down" }));
    }
  }, [angles.leftLateralRaiseAngle, bodyVisible]);

  useEffect(() => {
    if (
      bodyVisible &&
      angles.leftLateralRaiseAngle > 65 &&
      stages.leftLateralRaiseStage === "down"
    ) {
      setStages((prev) => ({ ...prev, leftLateralRaiseStage: "up" }));
      setCounts((prev) => ({
        ...prev,
        leftLateralRaiseCount: prev.leftLateralRaiseCount + 1,
      }));
    }
  }, [angles.leftLateralRaiseAngle, stages.leftLateralRaiseStage, bodyVisible]);

  useEffect(() => {
    if (bodyVisible && angles.rightLateralRaiseAngle < 20) {
      setStages((prev) => ({ ...prev, rightLateralRaiseStage: "down" }));
    }
  }, [angles.rightLateralRaiseAngle, bodyVisible]);

  useEffect(() => {
    if (
      bodyVisible &&
      angles.rightLateralRaiseAngle > 65 &&
      stages.rightLateralRaiseStage === "down"
    ) {
      setStages((prev) => ({ ...prev, rightLateralRaiseStage: "up" }));
      setCounts((prev) => ({
        ...prev,
        rightLateralRaiseCount: prev.rightLateralRaiseCount + 1,
      }));
    }
  }, [
    angles.rightLateralRaiseAngle,
    stages.rightLateralRaiseStage,
    bodyVisible,
  ]);

  useEffect(() => {
    if (
      bodyVisible &&
      angles.leftCurlAngle > 160 &&
      angles.leftLateralRaiseAngle > 160 &&
      stages.leftShoulderRaiseStage === "down"
    ) {
      setStages((prev) => ({ ...prev, leftShoulderRaiseStage: "up" }));
      setCounts((prev) => ({
        ...prev,
        leftShoulderRaiseCount: prev.leftShoulderRaiseCount + 1,
      }));
    } else if (
      bodyVisible &&
      (angles.leftCurlAngle < 160 || angles.leftLateralRaiseAngle < 160)
    ) {
      setStages((prev) => ({ ...prev, leftShoulderRaiseStage: "down" }));
    }
  }, [
    angles.leftCurlAngle,
    angles.leftLateralRaiseAngle,
    stages.leftShoulderRaiseStage,
    bodyVisible,
  ]);

  useEffect(() => {
    if (
      bodyVisible &&
      angles.rightCurlAngle > 160 &&
      angles.rightLateralRaiseAngle > 160 &&
      stages.rightShoulderRaiseStage === "down"
    ) {
      setStages((prev) => ({ ...prev, rightShoulderRaiseStage: "up" }));
      setCounts((prev) => ({
        ...prev,
        rightShoulderRaiseCount: prev.rightShoulderRaiseCount + 1,
      }));
    } else if (
      bodyVisible &&
      (angles.rightCurlAngle < 160 || angles.rightLateralRaiseAngle < 160)
    ) {
      setStages((prev) => ({ ...prev, rightShoulderRaiseStage: "down" }));
    }
  }, [
    angles.rightCurlAngle,
    angles.rightLateralRaiseAngle,
    stages.rightShoulderRaiseStage,
    bodyVisible,
  ]);

  return { angles, stages, counts, bodyVisible, setCounts, setStages };
};

export default usePoseDetection;
