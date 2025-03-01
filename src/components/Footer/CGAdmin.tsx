import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube
} from "@tabler/icons-react";
import Image from "next/image";

const CGAdminFooter = () => {
  return (
    <footer className="mt-auto w-full border-t border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-col items-center justify-between  md:ml-10 md:flex-row md:px-2 lg:ml-10 2xl:px-10">
        <div className="flex flex-col items-center p-2 md:flex-row md:items-start md:justify-start">
          <Image
            width={250}
            height={250}
            src={"/images/logo/axolotl.svg"}
            alt="Logo"
          />
        </div>

        <div className="mt-7 flex items-center gap-5 md:ml-20 md:mt-0 md:items-start">
          <span className="mt-2 text-lg dark:text-white">Help Center</span>
          <span className="mt-2 text-lg dark:text-white">Terms & Privacy</span>
        </div>

        <div className="mt-6 flex justify-center md:mt-0 md:w-1/3 md:justify-end lg:w-1/4 xl:w-1/5 2xl:w-1/6">
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

export default CGAdminFooter;
