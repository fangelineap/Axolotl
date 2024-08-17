import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axolotl - Admin Homepage",
};

const AdminDashboard = () => {
  return (
    <DefaultLayout>
      <h1 className="text-center text-heading-2">
        Quick links to our <b>services</b> 🚀
      </h1>

      <div className="flex flex-col items-center justify-between gap-10 p-15 xl:flex-row xl:items-start xl:justify-between">
        <Image
          src={"/images/freepik/admin-home.svg"}
          alt="Admin Home"
          width={524}
          height={510}
        />
        <div className="flex flex-col gap-10">
          <div className="text-center xl:text-right">
            <h1 className="text-heading-4 font-medium">Order Logs</h1>
            <div className="mt-5 flex justify-center gap-4 xl:justify-end">
              <a href="/admin/order/service" title="Order Service">
                <Image
                  src={"/images/freepik/admin-order-service.svg"}
                  alt="Admin Order Service"
                  width={150}
                  height={150}
                  className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                />
              </a>
              <a href="/admin/order/medicine" title="Order Medicine">
                <Image
                  src={"/images/freepik/admin-order-med.svg"}
                  alt="Admin Order Medicine"
                  width={150}
                  height={150}
                  className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                />
              </a>
            </div>
          </div>
          <div className="text-center xl:text-right">
            <h1 className="text-heading-4 font-medium">Management</h1>
            <div className="mt-5 flex justify-center gap-4 xl:justify-end">
              <a href="/admin/manage/user" title="Manage User">
                <Image
                  src={"/images/freepik/admin-manage-user.svg"}
                  alt="Admin Manage User"
                  width={150}
                  height={150}
                  className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                />
              </a>
              <a href="/admin/manage/approval" title="Manage Approval">
                <Image
                  src={"/images/freepik/admin-manage-approval.svg"}
                  alt="Admin Manage Approval"
                  width={150}
                  height={150}
                  className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                />
              </a>
              <a href="/admin/manage/medicine" title="Manage Medicine">
                <Image
                  src={"/images/freepik/admin-manage-med.svg"}
                  alt="Admin Manage Medicine"
                  width={150}
                  height={150}
                  className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminDashboard;
