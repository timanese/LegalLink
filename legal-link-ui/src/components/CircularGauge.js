import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularGauge = ({ value }) => {
  const grade = value.toFixed(0) / 10;

  return (
    <div style={{ width: "50%", maxWidth: "300px", margin: "0 auto" }}>
      <CircularProgressbar
        value={grade * 10}
        text={`${grade} / 10`}
        styles={buildStyles({
          strokeLinecap: "butt",
          textSize: "1vw",
          pathTransitionDuration: 0.5,
          pathColor: grade >= 8 ? "green" : grade >= 5 ? "orange" : "red",
          textColor: grade >= 8 ? "green" : grade >= 5 ? "orange" : "red",
          trailColor: "#d6d6d6",
          backgroundColor: "#3e98c7",
        })}
      />
    </div>
  );
};

export default CircularGauge;
