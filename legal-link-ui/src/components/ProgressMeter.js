import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import React from "react";

export default function ProgressMeter(props) {
  const { steps, activeStep } = props;
  console.log("PROPS: ", props);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => {
          return (
            <Step key={step?.label}>
              <StepLabel>{step?.label}</StepLabel>
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
          <Card sx={{ width: "100%", height: "100%", overflow: "auto", my: 2 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {steps[activeStep].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {steps[activeStep].description}
              </Typography>
            </CardContent>
          </Card>
        </React.Fragment>
      )}
    </Box>
  );
}
