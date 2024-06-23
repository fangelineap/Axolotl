import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-col justify-between px-5 pt-10 md:flex-row md:px-2 2xl:px-10">
        <div className="flex flex-col px-25 md:flex-row md:items-start">
          <div className="flex flex-col items-start">
            <Link href="/">
              <div className="cursor-pointer rounded-md p-2 dark:hidden">
                <Image
                  width={250}
                  height={250}
                  src={"/images/logo/logo-axolotl-main.svg"}
                  alt="Logo"
                />
              </div>
              <div className="hidden cursor-pointer rounded-md bg-white p-2 dark:block">
                <Image
                  width={250}
                  height={250}
                  src={"/images/logo/logo-axolotl-main.svg"}
                  alt="Logo"
                />
              </div>
              {/* <div className="cursor-pointer">
                <Image
                  width={250}
                  height={250}
                  src="/images/logo/logo-axolotl-main.svg"
                  alt="Logo"
                />
              </div> */}
            </Link>
            <span className="font-extrabold">
              To improve Health for a Better Live, by
            </span>
            <span>prioritizing your health at your house.</span>
            <div className="py-6">
              <Image
                width={200}
                height={200}
                src="/images/logo/copyright.svg"
                alt="Copyright"
              />
            </div>
          </div>
          <div className="mt-7 flex flex-col items-start md:ml-20 md:mt-0">
            <span className="text-lg text-gray-800 dark:text-white">
              Company
            </span>
            <span className="mt-2 text-gray-500 dark:text-gray-400">
              About Us
            </span>
            <span className="mt-2 text-gray-500 dark:text-gray-400">
              Careers
            </span>
            <span className="mt-2 text-gray-500 dark:text-gray-400">
              Security
            </span>
            <span className="mt-2 text-gray-500 dark:text-gray-400">
              Terms & Privacy
            </span>
          </div>
        </div>
        <div className="absolute right-5  flex space-x-3">
          <Image
            width={20}
            height={20}
            src="/images/icon/instagram.svg"
            alt="Instagram"
          />
          <Image
            width={20}
            height={20}
            src="/images/icon/twitter.svg"
            alt="Twitter"
          />
          <Image
            width={20}
            height={20}
            src="/images/icon/linkedin.svg"
            alt="Linkedin"
          />
          <Image
            width={20}
            height={20}
            src="/images/icon/youtube.svg"
            alt="Youtube"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
