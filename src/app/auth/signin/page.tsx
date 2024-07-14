import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import PasswordInput from "../component/PasswordInput";
import { signInWithEmailAndPassword } from "@/app/server-action/auth";
import { redirect } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Next.js Form Layout Page | NextAdmin - Next.js Dashboard Kit",
//   description: "This is Next.js Form Layout page for NextAdmin Dashboard Kit",
// };

const SignIn = () => {
  const signIn = async (form: FormData) => {
    "use server";

    const { error, data } = await signInWithEmailAndPassword(
      form.get("email")!.toString(),
      form.get("password")!.toString(),
    );

    console.log("Errorr ", error);
    console.log("Dataaa ", data);

    if (data) {
      redirect("/pages/admin");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sign In Form" />
      <div className="flex justify-center pb-9 pt-3">
        {/* <!-- Sign In Form --> */}
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-5/12">
          <div className="rounded-t-[10px] border-b border-stroke bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white">
              Sign In
            </h3>
          </div>
          <form action={signIn}>
            <div className="p-6.5">
              <div className="flex flex-col items-center justify-center pb-6">
                <h1 className="text-xl font-bold">Welcome back!</h1>
                <h3>Sign in to your account</h3>
              </div>

              <InputGroup
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                customClasses="mb-4.5"
                required
              />

              <PasswordInput label="Password" name="password" />

              <div className="mb-5.5 mt-3 flex items-center justify-end">
                <Link
                  href="#"
                  className="text-body-sm text-primary hover:underline"
                >
                  Forget password?
                </Link>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="flex w-1/3 justify-center rounded-[7px] bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                >
                  Sign In
                </button>
              </div>

              <p className="mt-3 text-center text-body-sm">
                Don't have an account?{" "}
                <span>
                  <Link href="signup" className="text-primary hover:underline">
                    Sign Up
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

export default SignIn;
