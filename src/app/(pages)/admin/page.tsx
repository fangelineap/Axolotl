import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Axolotl - Admin Homepage",
};

const AdminDashboard = () => {
  return (
    <DefaultLayout>
      <h1 className="text-center text-heading-2">
        Quick links to our <b>services</b> 🚀
      </h1>

      <div className="flex w-full items-center justify-center">
        <div className="flex w-[85%] flex-col items-center justify-between gap-5 p-15 xl:flex-row xl:items-start xl:gap-0">
          <Image
            src={"/images/freepik/admin-home.svg"}
            alt="Admin Home"
            width={400}
            height={390}
            className="hidden xl:block"
          />
          <div className="flex flex-col gap-10">
            <div className="text-center xl:text-right">
              <h1 className="text-heading-4 font-medium">Order Logs</h1>
              <div className="mt-5 flex justify-center gap-4 xl:justify-end">
                <Link href="/admin/order/service" title="Order Service">
                  <Image
                    src={"/images/freepik/admin-order-service.svg"}
                    alt="Admin Order Service"
                    width={125}
                    height={125}
                    className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                  />
                </Link>
                <Link href="/admin/order/medicine" title="Order Medicine">
                  <Image
                    src={"/images/freepik/admin-order-med.svg"}
                    alt="Admin Order Medicine"
                    width={125}
                    height={125}
                    className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                  />
                </Link>
              </div>
            </div>
            <div className="text-center xl:text-right">
              <h1 className="text-heading-4 font-medium">Management</h1>
              <div className="mt-5 flex justify-center gap-4 xl:justify-end">
                <Link href="/admin/manage/user" title="Manage User">
                  <Image
                    src={"/images/freepik/admin-manage-user.svg"}
                    alt="Admin Manage User"
                    width={125}
                    height={125}
                    className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                  />
                </Link>
                <Link href="/admin/manage/approval" title="Manage Approval">
                  <Image
                    src={"/images/freepik/admin-manage-approval.svg"}
                    alt="Admin Manage Approval"
                    width={125}
                    height={125}
                    className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                  />
                </Link>
                <Link href="/admin/manage/medicine" title="Manage Medicine">
                  <Image
                    src={"/images/freepik/admin-manage-med.svg"}
                    alt="Admin Manage Medicine"
                    width={125}
                    height={125}
                    className="cursor-pointer grayscale transition-colors duration-300 hover:grayscale-0"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminDashboard;
