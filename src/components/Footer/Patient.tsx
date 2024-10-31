import Image from "next/image";
import Link from "next/link";

// FIXME: FIX THE LAYOUT OF THE FOOTER

const PatientFooter = () => {
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
            <span className="mt-4 text-center font-extrabold md:mt-2 md:text-left">
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
          <div className="mt-7 flex flex-col items-center md:ml-20 md:mt-0 md:items-start">
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

        <div className="mt-6 flex justify-center md:mt-0 md:w-1/3 md:justify-end lg:w-1/4 xl:w-1/5 2xl:w-1/6">
          <div className="flex">
            <div className="rounded-md p-2 hover:bg-gray-1">
              <Image
                width={20}
                height={20}
                src="/images/icon/instagram.svg"
                alt="Instagram"
              />
            </div>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-1">
              <Image
                width={20}
                height={20}
                src="/images/icon/twitter.svg"
                alt="Twitter"
              />
            </div>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-1">
              <Image
                width={20}
                height={20}
                src="/images/icon/linkedin.svg"
                alt="Linkedin"
              />
            </div>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-1">
              <Image
                width={20}
                height={20}
                src="/images/icon/youtube.svg"
                alt="Youtube"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PatientFooter;
