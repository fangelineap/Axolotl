export const getAdminMetadata = (page: string) => {
  switch (page) {
    case "Manage Medicine":
      return {
        title: "Axolotl Admin - Manage Medicine",
        description: "Manage Medicine"
      };
    case "Add Medicine":
      return {
        title: "Axolotl Admin - Add Medicine",
        description: "Add Medicine"
      };
    case "Manage Approval":
      return {
        title: "Axolotl Admin - Manage Approval",
        description: "Manage Approval"
      };
    case "Manage User":
      return {
        title: "Axolotl Admin - Manage User",
        description: "Manage User"
      };
    case "Add User":
      return {
        title: "Axolotl Admin - Add User",
        description: "Add User"
      };
    case "Order Medicine":
      return {
        title: "Axolotl Admin - Order Medicine Logs",
        description: "Order Medicine Logs"
      };
    case "Order Service":
      return {
        title: "Axolotl Admin - Order Service Logs",
        description: "Order Service Logs"
      };
    default:
      return {
        title: "Axolotl Admin - Home",
        description: "Axolotl Admin - Home"
      };
  }
};
