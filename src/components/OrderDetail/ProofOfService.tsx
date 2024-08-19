import React from "react";

interface ProofOfServiceProps {
  imageUrl: string;
}

const ProofOfService: React.FC<ProofOfServiceProps> = ({ imageUrl }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">Evidence</h2>
      <div className="border p-4">
        <h3 className="mb-2 text-lg font-bold">Proof of Service</h3>
        <img
          src={imageUrl}
          alt="Proof of Service"
          className="h-auto max-w-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default ProofOfService;
