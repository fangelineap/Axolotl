import React from "react";

interface AuthStepperProps {
  role: string;
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
  role,
  currentStep,
  caregiverVerificationStatus = ""
}: AuthStepperProps) {
  const caregiverSteps = [
    { label: "Choose Role", number: 1 },
    { label: "Create Account", number: 2 },
    { label: "Personal Information", number: 3 },
    { label: "Review", number: 4 },
    { label: "Finish", number: 5 }
  ];

  const patientSteps = [
    { label: "Choose Role", number: 1 },
    { label: "Create Account", number: 2 },
    { label: "Personal Information", number: 3 },
    { label: "Finish", number: 4 }
  ];

  const dynamicStep =
    caregiverVerificationStatus === "Verified" ? 5 : currentStep;

  return (
    <div className="mb-5 flex items-center justify-center">
      <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
        {role === "Patient"
          ? patientSteps.map((step) => {
              const isActive = step.number <= dynamicStep;

              return (
                <StepIndicator
                  key={step.number}
                  label={step.label}
                  number={step.number}
                  isActive={isActive}
                />
              );
            })
          : caregiverSteps.map((step) => {
              const isActive = step.number <= dynamicStep;

              return (
                <StepIndicator
                  key={step.number}
                  label={step.label}
                  number={step.number}
                  isActive={isActive}
                />
              );
            })}
      </div>
    </div>
  );
}

export default AuthStepper;
