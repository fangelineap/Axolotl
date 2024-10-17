export const getCaregiverMetadata = (page: string) => {
  switch (page) {
    case "Review":
      return {
        title: "Caregiver - Review Status",
        description: "Order Service Logs"
      };
    default:
      return {
        title: "Caregiver - Home",
        description: "Caregiver - Home"
      };
  }
};
