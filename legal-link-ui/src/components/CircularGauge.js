import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularGauge = ({ value }) => {
  const percentage = value.toFixed(0);

  return (
    <div style={{ width: "50%", maxWidth: "300px", margin: "0 auto" }}>
      <CircularProgressbar
        value={value}
        text={`${percentage}%`}
        styles={buildStyles({
          strokeLinecap: "butt",
          textSize: "1.2vw",
          pathTransitionDuration: 0.5,
          pathColor: `rgba(62, 152, 199, ${value / 100})`,
          textColor: "#f88",
          trailColor: "#d6d6d6",
          backgroundColor: "#3e98c7",
        })}
      />
    </div>
  );
};

export default CircularGauge;
