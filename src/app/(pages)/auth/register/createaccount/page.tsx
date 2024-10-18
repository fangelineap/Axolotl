import { getUserFromSession } from "@/lib/server";
import { registerWithEmailAndPassword } from "@/app/_server-action/auth";
import InputGroup from "@/components/FormElements/InputGroup";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { redirect } from "next/navigation";
import PasswordInput from "@/components/Axolotl/InputFields/PasswordInput";

const CreateAccount = async ({ searchParams }: any) => {
  /**
   * Get user from session
   */
  const { data: userSession } = await getUserFromSession();

  if (userSession) {
    if (userSession.role === "Patient") {
      redirect("/patient");
    } else if (["Nurse", "Midwife"].includes(userSession.role)) {
      redirect("/caregiver");
    } else if (userSession.role === "Admin") {
      redirect("/admin");
    }
  }

  const toPersonalInformation = async (form: FormData) => {
    "use server";
    if (
      form.get("password")?.toString() ==
      form.get("confirmPassword")?.toString()
    ) {
      const { error } = await registerWithEmailAndPassword(
        form.get("email")!.toString(),
        form.get("password")!.toString(),
        form.get("phoneNumber")!.toString(),
        form.get("firstName")!.toString(),
        form.get("lastName")!.toString(),
        searchParams.role
      );

      if (error) {
        redirect(
          `/auth/register/createaccount?role=${searchParams.role}&message=exist`
        );
      } else {
        redirect(
          `/auth/register/createaccount/personalinformation?role=${searchParams.role}`
        );
      }
    }

    redirect(
      `/auth/register/createaccount?role=${searchParams.role}&message=pass`
    );
  };

  return (
    <DefaultLayout>
      {/* Stepper */}
      <div className="mb-3.5 flex items-center justify-center">
        <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              1
            </h2>
            <h2>Choose Role</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              2
            </h2>
            <h2>Create Account</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
              3
            </h2>
            <h2>Personal Infomation</h2>
          </div>
          {searchParams.role === "Caregiver" && (
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
                4
              </h2>
              <h2>Review</h2>
            </div>
          )}
          <div className="flex items-center justify-start gap-1">
            <h2
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white`}
              // ${searchParams.role === "Caregiver" && window.screen.width > 1000 && "ml-2"}
            >
              {searchParams.role === "Caregiver" ? 5 : 4}
            </h2>
            <h2>Finish</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-9 pt-3">
        {/* Create Account Form*/}
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-5/12">
          <div className="rounded-t-[10px] border-b border-stroke bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white">
              Create Your Account
            </h3>
          </div>
          <form action={toPersonalInformation}>
            <div className="p-6.5">
              <div className="flex flex-col items-center justify-center pb-6">
                <h1 className="text-xl font-bold">Please enter your details</h1>
                <h3>Fill this form below to create your account</h3>
              </div>

              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                <InputGroup
                  name="firstName"
                  label="First name"
                  type="text"
                  placeholder="Enter your first name"
                  customClasses="w-full xl:w-1/2"
                  required
                />

                <InputGroup
                  name="lastName"
                  label="Last name"
                  type="text"
                  placeholder="Enter your last name"
                  customClasses="w-full xl:w-1/2"
                  required
                />
              </div>

              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                <InputGroup
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  customClasses="w-full xl:w-1/2"
                  required
                />

                <div className="w-full xl:w-1/2">
                  <div className="mb-3 flex w-full flex-col gap-2">
                    <label className="font-medium">
                      Phone Number <span className="ml-1 text-red">*</span>
                    </label>
                    <div className="flex w-full items-center">
                      <label className="rounded-l-md border border-r-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
                        +62
                      </label>
                      <input
                        className="w-full rounded-r-md border border-gray-1 bg-white p-2 font-normal text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="8XXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <PasswordInput
                name="password"
                placeholder="Enter your password"
                label="Password"
                required
              />
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm your password"
                label="Confirm Password"
                required
              />

              {searchParams.message != null && (
                <div className="visible mb-4.5 rounded-md bg-red-400 p-3">
                  <p className="ml-3 text-sm font-medium text-white">
                    {searchParams.message == "pass"
                      ? "Password does not match"
                      : "User with this email already exist"}
                  </p>
                </div>
              )}

              <div className="mt-5.5 flex justify-center gap-3">
                <Link className="w-1/4" href="javascript:history.back()">
                  <button className="w-full rounded-[7px] bg-gray-cancel-hover p-[8px] font-medium text-white hover:bg-opacity-90">
                    Back
                  </button>
                </Link>
                <button
                  type="submit"
                  className="w-1/4 rounded-[7px] bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                >
                  Next
                </button>
              </div>

              <p className="mt-3 text-center text-body-sm">
                Already have an account?{" "}
                <span>
                  <Link href="signup" className="text-primary hover:underline">
                    Sign in instead
                  </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateAccount;
