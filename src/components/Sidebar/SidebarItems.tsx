import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ClickOutside from "@/components/ClickOutside";

interface DropdownItem {
  route: string;
  label: string;
}

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  route?: string;
  dropdownItems?: DropdownItem[];
}

interface SidebarItemProps {
  item: MenuItem;
  pageName: string;
  setPageName: (pageName: string) => void;
}

const SidebarItems: React.FC<SidebarItemProps> = ({
  item,
  pageName,
  setPageName,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleClick = () => {
    setPageName(item.label);
    if (item.dropdownItems) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  return (
    <ClickOutside
      onClick={() => setDropdownOpen(false)}
      exceptionRef={dropdownRef}
    >
      <li>
        <div
          onClick={handleClick}
          className={`flex cursor-pointer items-center gap-4 rounded-md p-4 hover:bg-gray-200 dark:hover:bg-gray-700 ${
            pageName === item.label ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
        {item.dropdownItems && dropdownOpen && (
          <ul ref={dropdownRef} className="pl-8">
            {item.dropdownItems.map((dropdownItem, index) => (
              <li key={index} className="p-2">
                <Link href={dropdownItem.route}>
                  <div>{dropdownItem.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    </ClickOutside>
  );
};

export default SidebarItems;
