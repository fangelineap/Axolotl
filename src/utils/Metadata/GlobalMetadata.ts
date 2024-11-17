export const getGlobalMetadata = (page: string, userRole?: string) => {
  switch (page) {
    case "Profile":
      return {
        title: `Your Profile Page`,
        description: `Your Profile Page`
      };
    case "EditProfile":
      return {
        title: `Editing Profile Page`,
        description: `Editing Profile Page`
      };
    case "Chat":
      return {
        title: `Chat with ${userRole?.toLowerCase() === "patient" ? "your caregiver" : "your patient"}`,
        description: `Chat with your patient or caregiver`
      };
    default:
      return undefined;
  }
};
