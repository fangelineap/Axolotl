import { getUserDataFromSession, logout } from "@/app/lib/server";
import ClickOutside from "@/components/ClickOutside";
import { USER_DETAILS_AUTH_SCHEMA } from "@/types/axolotl";
import { IconLogout2, IconSettings, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<USER_DETAILS_AUTH_SCHEMA | null>(null);

  useMemo(() => {
    const fetchUserData = async () => {
      const user = await getUserDataFromSession();
      if (!user) {
        setUser(null);
        return;
      }

      setUser(user as USER_DETAILS_AUTH_SCHEMA);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setUser(null);
    await logout()
  };

  const userImage = useMemo(() => {
    if (!user) return null;

    if (user.role === "Nurse" || user.role === "Midwife") {
      return (
        <Image
          width={112}
          height={112}
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_photo/${encodeURIComponent(user.caregiver?.profile_photo || "")}`}
          style={{ width: "auto", height: "auto" }}
          alt="User"
          className="overflow-hidden rounded-full"
        />
      );
    } else if (user.role === "Patient") {
      return (
        <Image
          src="/images/user/patient.png"
          alt="Default Patient Profile Photo"
          width={200}
          height={200}
          priority
          className="h-full w-full object-cover"
        />
      );
    } else {
      return (
        <Image
          src="/images/user/Default Admin Photo.png"
          alt="Admin Profile Photo"
          width={200}
          height={200}
          priority
          className="h-full w-full object-cover"
        />
      );
    }
  }, [user]);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <div className="h-12 w-12 overflow-hidden rounded-full border">
        <span className="h-12 w-12 rounded-full">{userImage}</span>
        </div>
      </Link>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <span className="relative block h-12 w-12 rounded-full border">
            <div className="h-12 w-12 overflow-hidden rounded-full">
              {userImage}
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark" />
            </span>

            <span className="block">
              <span className="block font-medium text-dark dark:text-white">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="block font-medium text-dark-5 dark:text-dark-6">
                {user?.email}
              </span>
            </span>
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
