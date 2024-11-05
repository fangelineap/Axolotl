import { logout } from "@/app/_server-action/auth";
import { getGlobalUserProfilePhoto } from "@/app/_server-action/global";
import ClickOutside from "@/components/ClickOutside";
import { getUserDataFromSession } from "@/lib/server";
import { USER_DETAILS_AUTH_SCHEMA } from "@/types/AxolotlMultipleTypes";
import { Skeleton } from "@mui/material";
import { IconLogout2, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR, { mutate } from "swr";

async function fetcher() {
  const user = await getUserDataFromSession();

  if (!user) {
    return null;
  }

  let imageUrl;
  const assertedUser = user as USER_DETAILS_AUTH_SCHEMA;

  if (user.role === "Patient") {
    imageUrl = "/images/user/Default Patient Photo.png";
  }

  if (user.role === "Admin") {
    imageUrl = "/images/user/Default Admin Photo.png";
  }

  if (user.role === "Caregiver") {
    imageUrl = "/images/user/Default Caregiver Photo.png";
  }

  if (["Nurse", "Midwife"].includes(user.role)) {
    const profilePhoto = await getGlobalUserProfilePhoto(
      assertedUser.caregiver?.profile_photo!
    );
    imageUrl = profilePhoto;
  }

  return { ...assertedUser, imageUrl };
}

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: user } = useSWR("userData", fetcher, {
    onSuccess: () => setLoading(false),
    onError: () => setLoading(false)
  });

  const handleLogout = async () => {
    await logout();
    mutate("userData", null);
  };

  /**
   * * Handle Image Load
   */
  const handleImageLoad = () => setLoading(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={(e) => {
          if (loading) {
            e.preventDefault();
          } else {
            setDropdownOpen(!dropdownOpen);
          }
        }}
        className={`flex items-center gap-4 ${loading ? "cursor-not-allowed" : ""}`}
        href="#"
      >
        <div
          className={`h-12 w-12 overflow-hidden rounded-full border ${loading ? "cursor-not-allowed" : ""}`}
        >
          <div className="flex h-full w-full items-center justify-center">
            {loading && (
              <Skeleton
                animation="wave"
                variant="circular"
                width={100}
                height={100}
              />
            )}
            {user?.imageUrl && (
              <Image
                width={200}
                height={200}
                src={user?.imageUrl}
                alt="User"
                priority
                className="h-full w-full rounded-full object-cover"
                onLoad={handleImageLoad}
              />
            )}
          </div>
        </div>
      </Link>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-xl border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <div className="relative block rounded-full border">
              <div className="h-12 w-12 overflow-hidden">
                {loading && (
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={48}
                    height={48}
                  />
                )}
                {user?.imageUrl && (
                  <Image
                    width={200}
                    height={200}
                    src={user?.imageUrl}
                    alt="User"
                    priority
                    className="h-full w-full rounded-full object-cover"
                    onLoad={handleImageLoad}
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark" />
            </div>

            <div className="flex w-full flex-col overflow-hidden">
              {loading ? (
                <Skeleton animation="wave" variant="text" width={100} />
              ) : (
                <p className="block font-medium text-dark dark:text-white">
                  {user?.first_name} {user?.last_name}
                </p>
              )}
              {loading ? (
                <Skeleton animation="wave" variant="text" width={200} />
              ) : (
                <p className="block max-w-xs truncate font-medium text-dark-5 dark:text-dark-6">
                  {user?.email}
                </p>
              )}
            </div>
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              <Link
                href={`/profile?user=${user?.user_id}&role=${user?.role}`}
                className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm text-black duration-150 ease-in-out hover:bg-gray"
              >
                <IconUser />
                View profile
              </Link>
            </li>
          </ul>
          <div className="p-2">
            <button
              className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm text-black duration-150 ease-in-out hover:bg-gray"
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
