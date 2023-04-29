import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

const steps = [
  {
    label: "Create Case",
    description:
      "This is where you send in initial information about your case.",
  },
  { label: "Case Evaluation", description: "We are evaluating your case." },
  { label: "Intake", description: "We are intaking." },
  {
    label: "Discovery",
    description: "Provide more detailed info about your case.",
  },
];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => {
          return (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {steps[activeStep].description}
          </Typography>
        </React.Fragment>
      )}
    </Box>
  );
}
