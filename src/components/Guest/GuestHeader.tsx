import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg0: boolean) => void;
}

const GuestHeader: React.FC<HeaderProps> = ({
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

          <h5 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
            Axolotl
          </h5>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="hidden lg:flex lg:w-full lg:items-center">
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
            <div className="flex w-full items-center justify-center">
              <ul className="flex items-center gap-10 py-3 text-xl">
                <li>
                  <Link href="/">
                    <div
                      className={`text-black hover:text-kalbe-light dark:text-white ${
                        isActive("/") ? "font-bold text-kalbe-light" : ""
                      }`}
                    >
                      Home
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/guest/about">
                    <div
                      className={`text-black hover:text-kalbe-light dark:text-white ${
                        isActive("/guest/about")
                          ? "font-bold text-kalbe-light"
                          : ""
                      }`}
                    >
                      About
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/guest/careers">
                    <div
                      className={`text-black hover:text-kalbe-light dark:text-white ${
                        isActive("/guest/careers")
                          ? "font-bold text-kalbe-light"
                          : ""
                      }`}
                    >
                      Careers
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
                    <div className="flex items-center justify-center gap-1">
                      <p>Health Services</p>
                      <Image
                        src={"/images/icon/icon-arrow-down.svg"}
                        alt="Arrow Down"
                        width={15}
                        height={15}
                      />
                    </div>
                  </div>
                  {dropdownOpen && (
                    <ul className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-dark">
                      <li className="border-b border-gray-1 dark:border-gray-700">
                        <Link href="/auth/signin">
                          <div className="block px-4 py-2 text-black hover:bg-gray hover:text-kalbe-light dark:text-white">
                            Nurses
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link href="/auth/signin">
                          <div className="block px-4 py-2 text-black hover:bg-gray hover:text-kalbe-light dark:text-white">
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
            <Link href="/auth/signin">
              <div className="text-black dark:text-white">
                <button className="rounded bg-kalbe-light px-4 py-2 text-white hover:bg-kalbe-medium">
                  Login
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute left-0 top-0 z-9999 h-screen w-72.5 bg-white dark:bg-gray-dark">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-2 top-2 z-50 p-2 text-white"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8332 4.16671C16.2113 4.54481 16.2113 5.1552 15.8332 5.5333L5.5333 15.8332C5.1552 16.2113 4.54481 16.2113 4.16671 15.8332C3.78861 15.4551 3.78861 14.8447 4.16671 14.4666L14.4666 4.16671C14.8447 3.78861 15.4551 3.78861 15.8332 4.16671Z"
                  fill=""
                />
                <path
                  d="M4.16667 4.16671C4.54477 3.78861 5.15516 3.78861 5.53326 4.16671L15.8332 14.4666C16.2113 14.8447 16.2113 15.4551 15.8332 15.8332C15.4551 16.2113 14.8447 16.2113 14.4666 15.8332L4.16667 5.5333C3.78857 5.1552 3.78857 4.54481 4.16667 4.16671Z"
                  fill=""
                />
              </svg>
            </button>
            <ul className="mt-20 space-y-6 px-6">
              <li>
                <Link href="/">
                  <div
                    className={`block text-black dark:text-white ${
                      isActive("/") ? "font-bold text-kalbe-light" : ""
                    }`}
                  >
                    Home
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/guest/about">
                  <div
                    className={`block text-black dark:text-white ${
                      isActive("/guest/about")
                        ? "font-bold text-kalbe-light"
                        : ""
                    }`}
                  >
                    About
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/guest/careers">
                  <div
                    className={`block text-black dark:text-white ${
                      isActive("/guest/careers")
                        ? "font-bold text-kalbe-light"
                        : ""
                    }`}
                  >
                    Careers
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default GuestHeader;
