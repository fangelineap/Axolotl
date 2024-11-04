export const getGlobalMetadata = (page: string) => {
  switch (page) {
    case "Profile":
      return {
        title: `Axolotl Profile Page`,
        description: `Axolotl Profile Page`
      };
    case "Chat":
      return {};
    default:
      return undefined;
  }
};
