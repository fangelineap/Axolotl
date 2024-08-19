import React from "react";

interface PatientInformationProps {
  name: string;
  address: string;
  phoneNumber: string;
  birthdate: string;
}

const PatientInformation: React.FC<PatientInformationProps> = ({
  name,
  address,
  phoneNumber,
  birthdate,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">Patient Information</h2>
      <p>
        <strong>Patient Name:</strong> {name}
      </p>
      <p>
        <strong>Address:</strong> {address}
      </p>
      <p>
        <strong>Phone Number:</strong> {phoneNumber}
      </p>
      <p>
        <strong>Birthdate:</strong> {birthdate}
      </p>
    </div>
  );
};

export default PatientInformation;
