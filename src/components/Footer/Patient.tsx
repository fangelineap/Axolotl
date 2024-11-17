import Image from "next/image";

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
          <div className="mt-7 flex flex-col gap-2 text-center text-dark-secondary md:ml-10 md:mt-0 md:text-left lg:ml-20 lg:items-start">
            <h1 className="text-lg text-black">Company</h1>
            <p>About Us</p>
            <p>Careers</p>
            <p>Security</p>
            <p>Terms & Privacy</p>
          </div>
        </div>

        <div className="mt-7 flex justify-center md:mt-0 md:w-1/3 md:justify-end lg:w-1/4 xl:w-1/5 2xl:w-1/6">
          <div className="flex">
            <div className="flex items-center rounded-md p-2 hover:bg-gray-1">
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
