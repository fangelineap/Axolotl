export const getCaregiverMetadata = (page: string) => {
  switch (page) {
    case "Review":
      return {
        title: "Caregiver - Review Status",
        description: "Order Service Logs"
      };
    case "schedule":
      return {
        title: "Caregiver - Schedule",
        description: "Schedule"
      };
    case "order history":
      return {
        title: "Caregiver - Order History",
        description: "Service Order Logs"
      };
    case "order detail":
      return {
        title: "Caregiver - Order Detail",
        description: "Order Detail"
      };
    case "prepare":
      return {
        title: "Caregiver - Medicine Preparation",
        description: "Medicine Preparation"
      };
    default:
      return {
        title: "Caregiver - Home",
        description: "Caregiver - Home"
      };
  }
};
