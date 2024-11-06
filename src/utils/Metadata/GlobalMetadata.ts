export const getGlobalMetadata = (page: string) => {
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
      return {};
    default:
      return undefined;
  }
};
