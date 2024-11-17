import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CaregiverSelection from "@/components/Patient/CaregiverSelection";
import Image from "next/image";

const Page = ({ searchParams }: any) => {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center">
        <div className="block w-full max-w-[85%]">
          <h1 className="mb-5 text-4xl font-bold">
            Book Your Appointment in Seconds
          </h1>
        </div>
        {/* Header */}
        <div className="relative min-h-[200px] w-full max-w-[85%] rounded-md bg-primary">
          <div className="flex min-h-[200px] flex-col  items-center lg:flex-row">
            <div className="mx-5 w-full p-3 lg:w-[30%]">
              <div className="mb-6 flex gap-2 rounded-md border border-white p-4 text-white">
                <h1 className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-semibold text-primary">
                  1
                </h1>
                <h1 className="text-base font-semibold">Set Your Location</h1>
              </div>
              <div className="flex gap-2 rounded-md border border-white p-4 text-white">
                <h1 className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-semibold text-primary">
                  2
                </h1>
                <h1 className="text-base font-semibold">
                  Choose Your Caregiver
                </h1>
              </div>
            </div>
            <div className="w-full p-3 lg:w-[35%]">
              <div className="mb-6 flex gap-2 rounded-md border border-white p-4 text-white">
                <h1 className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-semibold text-primary">
                  3
                </h1>
                <h1 className="text-base font-semibold">
                  Caregiver will accept right away
                </h1>
              </div>
              <div className="flex gap-2 rounded-md border border-white p-4 text-white">
                <h1 className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-semibold text-primary">
                  4
                </h1>
                <h1 className="text-base font-semibold">
                  Caregiver will come soon
                </h1>
              </div>
            </div>
          </div>
          <div className="flex justify-end md:relative">
            <Image
              width={200}
              height={200}
              className="w-200 h-56 rounded-br-md md:absolute md:bottom-0 md:right-0"
              src="/images/freepik/patient-health-services.svg"
              alt=""
            />
          </div>
        </div>
        <CaregiverSelection role={searchParams.caregiver} />
      </div>
    </DefaultLayout>
  );
};

export default Page;
