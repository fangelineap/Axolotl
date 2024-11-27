export const getPatientMetadata = (page: string) => {
  switch (page) {
    case "caregiver selection":
      return {
        title: "Patient - Caregiver Selection",
        description: "Patient - Caregiver Selection"
      };
    case "appointment":
      return {
        title: "Patient - Appointment",
        description: "Patient - Appointment"
      };
    case "additional medicine":
      return {
        title: "Patient - Additional Medicine",
        description: "Patient - Additional Medicine"
      };
    case "conjecture":
      return {
        title: "Patient - Conjecture",
        description: "Patient - Conjecture"
      };
    case "order form":
      return {
        title: "Patient - Order Form",
        description: "Patient - Order Form"
      };
    case "order history":
      return {
        title: "Patient - Order History",
        description: "Patient - Order History"
      };
    case "order detail":
      return {
        title: "Patient - Order Detail",
        description: "Patient - Order Detail"
      };
    default:
      return {
        title: "Patient - Home",
        description: "Patient - Home"
      };
  }
};
