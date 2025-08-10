import React, { useState, useEffect } from 'react';
import './TimeToEat.css';
import { FaRunning } from "react-icons/fa";
const periods = [
  { label: 'Morning', emoji: '☀️', time: '6:00 AM' },
  { label: 'Lunch', emoji: '🍱', time: '1:00 PM' },
  { label: 'Pre-Workout', emoji: '🏋️', time: '4:00 PM' },
  { label: 'Post-Workout', emoji: '🥤', time: '6:00 PM' },
  { label: 'Dinner', emoji: '🍽️', time: '8:00 PM' },
  { label: 'Before Sleep', emoji: '😴', time: '10:30 PM' },
];

const TimeToEat = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % periods.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getLeft = (index) => `${(index / (periods.length - 1)) * 100}%`;

  return (
    <div className="timeline-container">
        <h2>When to grab a bite?</h2>
      {/* Current time period shown above the runner */}
      <div className="active-period">
        <div className="emoji">{periods[currentIndex].emoji}</div>
        <div className="label">{periods[currentIndex].label}</div>
        <div className="time">{periods[currentIndex].time}</div>
      </div>
      {/* Line */}
    <div className="timeline-line">
        <div
          className="runner"
          style={{ left: getLeft(currentIndex) }}
        >
          <FaRunning className="runner-icon" />
        </div>
      </div>
    </div>
  );
};

export default TimeToEat;
