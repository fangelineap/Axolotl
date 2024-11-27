import { getOrder } from "@/app/_server-action/patient";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Conjecture from "@/components/Patient/Conjecture";
import { getPatientMetadata } from "@/utils/Metadata/PatientMetadata";

export const metadata = getPatientMetadata("conjecture");

async function fetchOrderData(conjecture: string) {
  const response = await getOrder(conjecture);

  return response;
}

const page = async ({ searchParams }: any) => {
  const order = await fetchOrderData(searchParams.appointment);

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center">
        {/* Stepper */}
        <div className="mb-3.5 flex items-center justify-center">
          <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
                1
              </h2>
              <h2>Place an Order</h2>
            </div>
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
                2
              </h2>
              <h2>Conjecture</h2>
            </div>
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
                3
              </h2>
              <h2>Additional</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <Conjecture diagnosis={order.diagnosis} symptoms={order.symptoms} />
      </div>
    </DefaultLayout>
  );
};

export default page;
