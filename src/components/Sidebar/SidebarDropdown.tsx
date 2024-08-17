import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ items }: any) => {
  const pathname = usePathname();

  return (
    <ul className="my-2 flex flex-col gap-1.5 pl-9">
      {items.map((dropdownItem: any, index: number) => (
        <li key={index}>
          <Link
            href={dropdownItem.route}
            className={`relative flex rounded-[7px] px-3.5 py-2 font-medium duration-300 ease-in-out ${
              pathname === dropdownItem.route
                ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
                : "text-dark-4 hover:bg-gray hover:text-primary dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            {dropdownItem.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;
