import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const SidebarItem = ({ item, pageName, setPageName, dropdownRef }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";

    return setPageName(updatedPageName);
  };

  return (
    <>
      <li>
        <div
          onClick={handleClick}
          className={`${
            pageName === item.label.toLowerCase()
              ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
              : ""
          } group relative flex cursor-pointer items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
        >
          {item.route ? (
            <Link href={item.route}>
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
            </Link>
          ) : (
            <>
              {item.icon}
              {item.label}
            </>
          )}

          {item.message && (
            <span className="absolute right-11.5 top-1/2 -translate-y-1/2 rounded-full bg-red-light-6 px-1.5 py-px text-[10px] font-medium leading-[17px] text-red">
              {item.message}
            </span>
          )}
          {item.pro && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
              Pro
            </span>
          )}
          {item.children && (
            <IconChevronDown
              stroke={1.5}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                pageName === item.label.toLowerCase() && "rotate-180"
              }`}
            />
          )}
        </div>

        {item.children && (
          <div
            className={`translate transform overflow-hidden ${
              pageName !== item.label.toLowerCase() && "hidden"
            }`}
            ref={dropdownRef}
          >
            <SidebarDropdown items={item.children} />
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
