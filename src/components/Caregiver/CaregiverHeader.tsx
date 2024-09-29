import DropdownUser from "@/components/Header/DropdownUser";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg0: boolean) => void;
}

const CaregiverHeader: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-2 py-2 md:px-2 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2 lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-150 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-200 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-dark delay-300 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-dark duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <h5 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
            Axolotl
          </h5>
        </div>

        <div className="lg:items-left hidden lg:flex lg:w-full lg:justify-between">
          <div className="mr-10 hidden lg:block">
            <Link href="/caregiver">
              <div className="cursor-pointer rounded-md p-2 dark:hidden">
                <Image
                  width={175}
                  height={175}
                  src={"/images/logo/axolotl.svg"}
                  alt="Logo"
                />
              </div>
            </Link>
          </div>
          <div className="flex flex-grow justify-start ">
            <ul className="flex items-center gap-5 py-3">
              <li>
                <Link href="/caregiver">
                  <div
                    className={`text-black hover:text-kalbe-light dark:text-white ${
                      isActive("/caregiver") ? "font-bold text-kalbe-light" : ""
                    }`}
                  >
                    Schedule
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/caregiver/order">
                  <div
                    className={`text-black hover:text-kalbe-light dark:text-white ${
                      isActive("/caregiver/order")
                        ? "font-bold text-kalbe-light"
                        : ""
                    }`}
                  >
                    Order
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="ml-auto">
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default CaregiverHeader;
