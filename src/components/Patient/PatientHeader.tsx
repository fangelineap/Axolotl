import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DropdownUser from "@/components/Header/DropdownUser";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg0: boolean) => void;
}

const PatientHeader: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

          <div>
            <h5 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
              Axolotl
            </h5>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-full lg:items-center lg:justify-between">
          <div className="mr-10 hidden lg:block">
            <Link href="/patient">
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
          <div className="flex flex-grow justify-center">
            <ul className="flex items-center gap-5 py-3">
              <li>
                <Link href="/patient">
                  <div
                    className={`text-black hover:text-kalbe-light dark:text-white ${
                      isActive("/patient") ? "font-bold text-kalbe-light" : ""
                    }`}
                  >
                    Dashboard
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/patient/order-history">
                  <div
                    className={`text-black hover:text-kalbe-light dark:text-white ${
                      isActive("/patient/order-history")
                        ? "font-bold text-kalbe-light"
                        : ""
                    }`}
                  >
                    Order History
                  </div>
                </Link>
              </li>

              <li
                className="relative"
                ref={dropdownRef}
                onClick={toggleDropdown}
              >
                <div
                  className={`cursor-pointer text-black hover:text-kalbe-light dark:text-white ${
                    dropdownOpen ? "text-kalbe-light" : ""
                  }`}
                >
                  <div className="flex">
                    <div className="flex-none">Health Services</div>
                    <div className="ml-2 mt-1 flex-none">
                      <Image
                        src={"/images/icon/icon-arrow-down.svg"}
                        alt="Arrow Down"
                        width={15}
                        height={15}
                      />
                    </div>
                  </div>
                </div>
                {dropdownOpen && (
                  <ul className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-dark">
                    <li className="border-b border-gray-1 dark:border-gray-700">
                      <Link href="/patient/health-services?caregiver=Nurse">
                        <div className="block px-4 py-2 text-black hover:bg-gray hover:text-green-light-1 dark:text-white">
                          Nurses
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/patient/health-services?caregiver=Midwife">
                        <div className="block px-4 py-2 text-black hover:bg-gray hover:text-green-light-1 dark:text-white">
                          Midwives
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
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

export default PatientHeader;
