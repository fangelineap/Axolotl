import { forgetPassword } from "@/app/_server-action/auth";
import InputGroup from "@/components/FormElements/InputGroup";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = getGuestMetadata("forgot");

const ForgetPassword = ({ searchParams }: any) => {
  const handleRedirect = async (form: FormData) => {
    "use server";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await forgetPassword(form.get("email")!.toString());
    if (error != null) {
      redirect("/auth/forgetpassword/?success=false");
    } else {
      redirect("/auth/forgetpassword/?success=true");
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-4 my-25 flex h-full w-auto justify-center md:mx-20 md:my-35">
        <div className="w-full lg:max-w-[50%]">
          <div className="rounded-t-xl border border-primary bg-primary py-3">
            <h1 className="text-center text-xl font-semibold text-white md:text-heading-5">
              Forget Password
            </h1>
          </div>
          <div className="rounded-b-xl border border-primary">
            <form action={handleRedirect}>
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-xl font-bold md:text-heading-6">
                    Confirm your email!
                  </h1>
                  <p>We will send an email to reset your password</p>
                </div>

                <div className="flex w-full flex-col gap-3">
                  <InputGroup
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    customClasses="mb-4.5"
                    required
                  />

                  {searchParams.success != null && (
                    <div
                      className={`hidden ${searchParams.success == "true" ? "visible bg-kalbe-veryLight" : "visible bg-red"} rounded-md p-3`}
                    >
                      <p className="text-sm font-medium text-white">
                        {searchParams.success == "true"
                          ? "Check your email"
                          : "Your email is not registered, please create an account"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full rounded-md border border-primary bg-primary px-3 py-2 text-lg font-semibold text-white hover:bg-kalbe-ultraLight hover:text-primary md:w-1/2"
                  >
                    Confirm Email
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ForgetPassword;
