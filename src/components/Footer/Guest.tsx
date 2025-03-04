"use client";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const GuestFooter = () => {
  return (
    <footer className="mt-auto w-full border-t border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-col items-center justify-between px-5 pt-10 md:ml-10 md:flex-row md:px-2 lg:ml-10 2xl:px-10">
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-start">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/">
              <div className="cursor-pointer rounded-md p-2 dark:hidden">
                <Image
                  width={250}
                  height={250}
                  src={"/images/logo/axolotl.svg"}
                  alt="Logo"
                />
              </div>
            </Link>
            <span className="mt-4 text-center font-bold md:mt-2 md:text-left">
              To improve Health for a Better Life, by
            </span>
            <span className="text-center md:text-left">
              prioritizing your health at your house.
            </span>
            <div className="py-6">
              <Image
                width={200}
                height={200}
                src="/images/logo/copyright.svg"
                alt="Copyright"
              />
            </div>
          </div>
          <div className="mt-7 flex flex-col items-center gap-2 md:ml-20 md:mt-10 md:items-start">
            <Link href="/">
              <span>Home</span>
            </Link>
            <Link href="/guest/about">
              <span>About</span>
            </Link>
            <Link href="/guest/careers">
              <span>Careers</span>
            </Link>
          </div>
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

export default GuestFooter;
