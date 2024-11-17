import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import PatientHome from "@/components/Patient/PatientHome";

const Home: React.FC = () => {
  return (
    <DefaultLayout>
      <PatientHome />
    </DefaultLayout>
  );
};

export default Home;
