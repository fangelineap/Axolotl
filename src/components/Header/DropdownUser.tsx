import { logout } from "@/app/_server-action/auth";
import { getGlobalUserProfilePhoto } from "@/app/_server-action/global";
import ClickOutside from "@/components/ClickOutside";
import { getUserDataFromSession } from "@/lib/server";
import { USER_DETAILS_AUTH_SCHEMA } from "@/types/AxolotlMultipleTypes";
import { IconLogout2, IconSettings, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = async () => {
  const user = await getUserDataFromSession();
  if (!user) {
    return null;
  }

  const assertedUser = user as USER_DETAILS_AUTH_SCHEMA;

  let imageUrl;
  if (assertedUser.role === "Patient") {
    imageUrl = "/images/user/Default Patient Photo.png";
  } else if (assertedUser.role === "Admin") {
    imageUrl = "/images/user/Default Admin Photo.png";
  } else {
    const profilePhoto = await getGlobalUserProfilePhoto(
      assertedUser.caregiver?.profile_photo!
    );
    imageUrl = profilePhoto || "/images/user/Default Caregiver Photo.png";
  }

  return { ...assertedUser, imageUrl };
};

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: user } = useSWR("userData", fetcher);

  const handleLogout = async () => {
    await logout();
    mutate("userData", null);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <div className="h-12 w-12 overflow-hidden rounded-full border">
          <div className="flex h-full w-full items-center justify-center">
            {user?.imageUrl && (
              <Image
                width={200}
                height={200}
                src={user.imageUrl}
                alt="User"
                priority
                className="h-full w-full rounded-full object-cover"
              />
            )}
          </div>
        </div>
      </Link>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <div className="relative block rounded-full border">
              <div className="h-12 w-12 overflow-hidden">
                {user?.imageUrl && (
                  <Image
                    width={200}
                    height={200}
                    src={user.imageUrl}
                    alt="User"
                    priority
                    className="h-full w-full rounded-full object-cover"
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark" />
            </div>

            <div className="flex w-full flex-col overflow-hidden">
              <p className="block font-medium text-dark dark:text-white">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="block max-w-xs truncate font-medium text-dark-5 dark:text-dark-6">
                {user?.email}
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              <Link
                href="/profile"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <IconUser />
                View profile
              </Link>
            </li>

            <li>
              <Link
                href="/settings"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <IconSettings />
                Account Settings
              </Link>
            </li>
          </ul>
          <div className="p-2.5">
            <button
              className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              onClick={handleLogout}
            >
              <IconLogout2 />
              Logout
            </button>
          </div>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
