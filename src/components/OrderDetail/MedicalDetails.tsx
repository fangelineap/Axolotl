import React from "react";

interface MedicalDetailsProps {
  causes: string;
  mainConcerns: string[];
  currentMedicine: string[];
  symptoms: string[];
  medicalDescriptions: string;
  conjectures: string[];
}

const MedicalDetails: React.FC<MedicalDetailsProps> = ({
  causes,
  mainConcerns,
  currentMedicine,
  symptoms,
  medicalDescriptions,
  conjectures,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">Medical Concerns & Conjecture</h2>
      <p>
        <strong>Causes:</strong> {causes}
      </p>
      <p>
        <strong>Main Concerns:</strong> {mainConcerns.join(", ")}
      </p>
      <p>
        <strong>Current Medicine:</strong> {currentMedicine.join(", ")}
      </p>
      <p>
        <strong>Symptoms:</strong> {symptoms.join(", ")}
      </p>
      <p>
        <strong>Medical Descriptions:</strong> {medicalDescriptions}
      </p>
      <div className="mt-2">
        {conjectures.map((conjecture, index) => (
          <span
            key={index}
            className="mr-2 inline-block rounded-full bg-green-500 px-3 py-1 text-xs text-white"
          >
            {conjecture}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MedicalDetails;
