import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-col items-center justify-center px-5 py-7 md:flex-row md:px-2 2xl:px-10">
        <div className="flex flex-col items-center py-7 md:items-start">
          <Link href="/">
            <div className="cursor-pointer">
              <Image
                width={250}
                height={250}
                src="/images/logo/axolotl-kalbe.svg"
                alt="Logo"
              />
            </div>
          </Link>
          <div className="py-3">
            <Image
              width={90}
              height={90}
              src="/images/logo/copyright.svg"
              alt="Copyright"
            />
          </div>
        </div>
        <div className="mt-7 flex flex-col items-center md:ml-20 md:mt-0 md:items-start">
          <span className="text-lg text-gray-800 dark:text-white">Company</span>
          <span className="mt-2 text-gray-500 dark:text-gray-400">
            About Us
          </span>
          <span className="mt-2 text-gray-500 dark:text-gray-400">Careers</span>
          <span className="mt-2 text-gray-500 dark:text-gray-400">
            Security
          </span>
          <span className="mt-2 text-gray-500 dark:text-gray-400">
            Term & Privacy
          </span>
        </div>
        <div className="mt-7 flex flex-col items-center md:ml-20  md:mt-0 md:items-start">
          <span className="text-lg text-gray-800 dark:text-white">
            Resources
          </span>
          <span className="mt-2 text-gray-500 dark:text-gray-400">
            Help Center
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
