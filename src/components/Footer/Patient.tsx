import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const PatientFooter = () => {
  return (
    <footer className="mt-auto w-full border-t border-stroke bg-white">
      <div className="mx-4 flex h-45 w-auto flex-col items-center justify-between py-10 md:mx-20 md:flex-row md:px-2">
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-start">
          <div className="flex flex-col items-center md:items-start">
            <div className="p-2 dark:hidden">
              <Image
                width={200}
                height={200}
                src={"/images/logo/axolotl.svg"}
                alt="Logo"
              />
            </div>
            <p className="mt-4 text-center font-bold md:mt-2 md:text-left">
              To improve Health for a Better Life, by
            </p>
            <p className="text-center md:text-left">
              prioritizing your health at your house.
            </p>
            <Image
              width={200}
              height={200}
              src="/images/logo/copyright.svg"
              alt="Copyright"
              className="mt-2"
            />
          </div>
          <div className="flex flex-col gap-3 text-center md:ml-10 md:mt-0 md:text-left lg:ml-20 lg:items-start">
            <Link href="/patient">
              <span>Dashboard</span>
            </Link>
            <Link href="/patient/order-history">
              <span>Order History</span>
            </Link>
            <Link href="/patient/health-services?role=Nurse">
              <span>Order Nurse</span>
            </Link>
            <Link href="/patient/health-services?role=Midwife">
              <span>Order Midwife</span>
            </Link>
          </div>
        </div>

        <div className="mt-7 flex justify-center md:mt-0 md:w-1/3 md:justify-end lg:w-1/4 xl:w-1/5 2xl:w-1/6">
          <div className="flex">
            <div className="rounded-md p-2 hover:bg-gray-1">
              <IconBrandInstagram size={30} stroke={1.5} />
            </div>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-1">
              <IconBrandX size={30} stroke={1.5} />
            </div>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-1">
              <IconBrandLinkedin size={30} stroke={1.5} />
            </div>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-1">
              <IconBrandYoutube size={30} stroke={1.5} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PatientFooter;
