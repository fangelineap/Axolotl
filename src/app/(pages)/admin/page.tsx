import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  IconFileCheck,
  IconFirstAidKit,
  IconMedicineSyrup,
  IconUsers,
  IconVaccine,
} from "@tabler/icons-react";
import { Metadata } from "next";
import Image from "next/image";
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
                  <div className="h-35 w-35 cursor-pointer">
                    <div className="flex h-full w-full flex-col items-center justify-between rounded-lg border-2 border-primary bg-primary p-2 text-white transition-colors duration-150 hover:bg-white hover:text-primary">
                      <IconFirstAidKit size={80} stroke={1} />
                      <p className="text-xl font-medium">Service</p>
                    </div>
                  </div>
                </Link>
                <Link href="/admin/order/medicine" title="Order Medicine">
                  <div className="h-35 w-35 cursor-pointer">
                    <div className="flex h-full w-full flex-col items-center justify-between rounded-lg border-2 border-primary bg-primary p-2 text-white transition-colors duration-150 hover:bg-white hover:text-primary">
                      <IconVaccine size={80} stroke={1} />
                      <p className="text-xl font-medium">Medicine</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="text-center xl:text-right">
              <h1 className="text-heading-4 font-medium">Management</h1>
              <div className="mt-5 flex justify-center gap-4 xl:justify-end">
                <Link href="/admin/manage/user" title="Manage User">
                  <div className="h-35 w-35 cursor-pointer">
                    <div className="flex h-full w-full flex-col items-center justify-between gap-1 rounded-lg border-2 border-primary bg-primary p-2 text-white transition-colors duration-150 hover:bg-white hover:text-primary">
                      <IconUsers size={80} stroke={1} />
                      <p className="text-xl font-medium">User</p>
                    </div>
                  </div>
                </Link>
                <Link href="/admin/manage/approval" title="Manage Approval">
                  <div className="h-35 w-35 cursor-pointer">
                    <div className="flex h-full w-full flex-col items-center justify-between gap-1 rounded-lg border-2 border-primary bg-primary p-2 text-white transition-colors duration-150 hover:bg-white hover:text-primary">
                      <IconFileCheck size={80} stroke={1} />
                      <p className="text-xl font-medium">Approval</p>
                    </div>
                  </div>
                </Link>
                <Link href="/admin/manage/medicine" title="Manage Medicine">
                  <div className="h-35 w-35 cursor-pointer">
                    <div className="flex h-full w-full flex-col items-center justify-between gap-1 rounded-lg border-2 border-primary bg-primary p-2 text-white transition-colors duration-150 hover:bg-white hover:text-primary">
                      <IconMedicineSyrup size={80} stroke={1} />
                      <p className="text-xl font-medium">Medicine</p>
                    </div>
                  </div>
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
