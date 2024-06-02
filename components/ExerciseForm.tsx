// src/components/ExerciseForm.tsx
import React, { useState } from 'react';
import PoseEstimation from './PoseEstimation';

const ExerciseForm: React.FC = () => {
  const [exercise, setExercise] = useState('Bicep Curl');
  const [repCount, setRepCount] = useState('6');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercise && repCount) {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    setSubmitted(false);
    setExercise('Bicep Curl');
    setRepCount('6');
  }

  return (
    <div className="flex justify-center items-center min-h-screen text-4xl">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center">
            <label className=" mb-2 text-white" htmlFor="exercise">
              Select Exercise Type
            </label>
            <select
              id="exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="border-8 border-yellow-500 rounded p-2 w-full"
            >
              <option value="Shoulder Press">Shoulder Press</option>
              <option value="Bicep Curl">Bicep Curl</option>
              <option value="Lateral Raises">Lateral Raises</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label className=" mb-2 text-white" htmlFor="repCount">
              Select Rep Count
            </label>
            <select
              id="repCount"
              value={repCount}
              onChange={(e) => setRepCount(e.target.value)}
              className="border-8 border-yellow-500 rounded p-2 w-full"
            >
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <button type="submit" className="bg-yellow-500 text-black rounded-full px-16 py-4">
            Start
          </button>
        </form>
      ) : (
        <PoseEstimation exercise={exercise} repCounts={parseInt(repCount, 10)} onBack={handleBack} />
      )}
    </div>
  );
};

export default ExerciseForm;
