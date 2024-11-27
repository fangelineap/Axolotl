import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderForm from "@/components/Patient/OrderForm/OrderForm";

const PlacingOrder = ({ searchParams }: any) => {
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
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
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
        <OrderForm
          caregiverId={searchParams.caregiver}
          serviceSelection={searchParams.service}
          date={searchParams.date}
          time={searchParams.time}
        />
      </div>
    </DefaultLayout>
  );
};

export default PlacingOrder;
