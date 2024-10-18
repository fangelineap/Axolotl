import React from "react";

interface Step {
  label: string;
  number: number;
}

interface AuthStepperProps {
  steps: Step[];
  currentStep: number;
  caregiverVerificationStatus?: string;
}

function StepIndicator({
  label,
  number,
  isActive
}: {
  label: string;
  number: number;
  isActive: boolean;
}) {
  return (
    <div className="flex items-center justify-start gap-2">
      <h2
        className={`flex h-7 w-7 items-center justify-center rounded-full ${isActive ? "bg-kalbe-light" : "bg-gray-cancel"} font-medium text-white`}
      >
        {number}
      </h2>
      <h2>{label}</h2>
    </div>
  );
}

function AuthStepper({
  steps,
  currentStep,
  caregiverVerificationStatus = ""
}: AuthStepperProps) {
  const dynamicStep =
    caregiverVerificationStatus === "Verified" ? 5 : currentStep;

  return (
    <div className="mb-3.5 flex items-center justify-center">
      <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
        {steps.map((step) => {
          const isActive = dynamicStep;

          return (
            <StepIndicator
              key={step.number}
              label={step.label}
              number={step.number}
              isActive={isActive === dynamicStep}
            />
          );
        })}
      </div>
    </div>
  );
}

AuthStepper.defaultProps = {
  steps: [
    { label: "Choose Role", number: 1 },
    { label: "Create Account", number: 2 },
    { label: "Personal Information", number: 3 },
    { label: "Review", number: 4 },
    { label: "Finish", number: 5 }
  ]
};

export default AuthStepper;
