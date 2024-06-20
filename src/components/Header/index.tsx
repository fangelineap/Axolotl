import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-2 py-2 md:px-2 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2 lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-dark delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-dark duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link href="/">
            <h5 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
              Axolotl
            </h5>
          </Link>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-end xl:w-auto xl:justify-normal">
          <div className="flex">
            <div className="hidden lg:block">
              <div>
                <Link href="/">
                  <Image
                    width={200}
                    height={200}
                    src={"/images/logo/axolotl.svg"}
                    alt="Logo"
                    className="cursor-pointer"
                  />
                </Link>
              </div>
            </div>
            <div className="flex">
              <ul className="lg:w-41 hidden items-center gap-5 py-3 lg:flex">
                <li>
                  <Link
                    href="/"
                    className={
                      pathname === "/"
                        ? "font-semibold text-green-500 dark:text-green"
                        : "text-black dark:text-white"
                    }
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/order"
                    className={
                      pathname === "/pages/order"
                        ? "font-semibold text-green-500 dark:text-green"
                        : "text-black dark:text-white"
                    }
                  >
                    Order
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/order-history"
                    className={
                      pathname === "/pages/order-history"
                        ? "font-semibold text-green-500 dark:text-green"
                        : "text-black dark:text-white"
                    }
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/medicine"
                    className={
                      pathname === "/pages/medicine"
                        ? "font-semibold text-green-500 dark:text-green"
                        : "text-black dark:text-white"
                    }
                  >
                    Medicine
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-end xl:w-auto xl:justify-normal">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggle --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggle --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
