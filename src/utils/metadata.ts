export const getMetadata = (page: string) => {
  switch (page) {
    case "careers":
      return {
        title: "Axolotl - Careers",
        description: "Join Axolotl and grow with us!",
      };
    case "about":
      return {
        title: "Axolotl - About Axolotl",
        description: "About Axolotl",
      };
    case "register":
      return {
        title: "Create Axolotl Account",
        description: "Create Axolotl Account",
      };
    case "sign in":
      return {
        title: "Sign in to Axolotl",
        description: "Sign in to Axolotl",
      };
    default:
      return {
        title: "Axolotl - Your Caregiver",
        description: "Axolotl - Your Caregiver",
      };
  }
};
