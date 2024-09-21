import ClickOutside from "@/components/ClickOutside";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import { IconInfoCircle, IconMedicalCross, IconSmartHome, IconStethoscope } from "@tabler/icons-react";
import Image from "next/image";
import React, { useRef } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: (
          <IconSmartHome />
        ),
        label: "Home",
        route: "/",
      },
      {
        icon: (
          <IconInfoCircle />
        ),
        label: "About",
        route: "/guest/about",
      },
      {
        icon: (
          <IconStethoscope />
        ),
        label: "Careers",
        route: "/guest/careers",
      },
      {
        icon: (
          <IconMedicalCross />
        ),
        label: "Health Service",
        route: "",
        children: [
          { label: "Nurses", route: "/guest/nurses" },
          { label: "Midwives", route: "/guest/midwives" },
        ],
      },
    ],
  },
];

const GuestSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <ClickOutside
      onClick={() => setSidebarOpen(false)}
      exceptionRef={dropdownRef}
    >
      <aside
        ref={dropdownRef}
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white transition-transform-opacity duration-300 ease-in-out dark:border-stroke-dark dark:bg-gray-dark ${
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <div className="cursor-pointer rounded-md p-2 dark:hidden">
            <Image
              width={190}
              height={32}
              src={"/images/logo/axolotl.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ height: "auto" }}
            />
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* SIDEBAR HEADER */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <li key={menuIndex} className="relative">
                      <SidebarItem
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                        dropdownRef={dropdownRef}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* Sidebar Menu */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default GuestSidebar;
