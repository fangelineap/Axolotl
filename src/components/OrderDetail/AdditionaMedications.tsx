import React from "react";

interface Medication {
  quantity: number;
  name: string;
  price: string;
}

interface AdditionalMedicationsProps {
  medications: Medication[];
}

const AdditionalMedications: React.FC<AdditionalMedicationsProps> = ({
  medications,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">Additional Medications</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{med.quantity}</td>
              <td className="border p-2">{med.name}</td>
              <td className="border p-2 text-right">{med.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdditionalMedications;
