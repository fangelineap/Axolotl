export const getGuestMetadata = (page: string) => {
  switch (page) {
    case "careers":
      return {
        title: "Axolotl - Careers",
        description: "Join Axolotl and grow with us!"
      };
    case "about":
      return {
        title: "Axolotl - About Axolotl",
        description: "About Axolotl"
      };
    case "register":
    case "create account":
      return {
        title: "Create Axolotl Account",
        description: "Create Axolotl Account"
      };
    case "personal information":
      return {
        title: "Complete Your Personal Information",
        description: "Complete Your Personal Information"
      };
    case "sign in":
      return {
        title: "Sign in to Axolotl",
        description: "Sign in to Axolotl"
      };
    case "forgot":
      return {
        title: "Forgot Password",
        description: "Forgot Password"
      };
    case "reset":
      return {
        title: "Reset Password",
        description: "Reset Password"
      };
    default:
      return {
        title: "Axolotl - Your Caregiver",
        description: "Axolotl - Your Caregiver"
      };
  }
};
