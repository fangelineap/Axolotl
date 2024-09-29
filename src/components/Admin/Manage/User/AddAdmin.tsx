import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddAdmin() {
  // const validateForm = (form: FormData) => {
  //   if (
  //     !form.get("name") &&
  //     !form.get("type") &&
  //     !form.get("price") &&
  //     !form.get("exp_date")
  //   ) {
  //     toast.error("Please insert a valid data.", {
  //       position: "bottom-right"
  //     });
  //     return false;
  //   }

  //   return true;
  // };

  return (
    <>
      <ToastContainer />
      <form>
        {/* Title */}
        <h1 className="mb-5 text-heading-1 font-bold">Add User</h1>
        {/* Container */}
        <div className="flex flex-col justify-between lg:flex-row">
          {/* Left Side */}
          <div className="w-[100%] lg:mr-11 lg:w-[65%]">
            <div className="mb-4 flex flex-col gap-2">
              <h1 className="text-lg font-semibold">User Account Details</h1>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-[100%] lg:w-[35%]">
            <div className="flex flex-col rounded-lg border border-gray-1 bg-white p-5">
              <div className="mb-5 flex items-center justify-center text-primary">
                <h1 className="text-center text-heading-4 font-bold">
                  User Type
                </h1>
              </div>
              <div className="flex flex-col gap-5">
                <button className="w-full rounded-[4px] border border-gray-cancel bg-gray-cancel py-2 text-lg font-semibold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel">
                  Go back
                </button>
                <button className="w-full rounded-[4px] border border-yellow-dark py-2 text-lg font-semibold text-yellow-dark hover:bg-yellow-light">
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddAdmin;
