import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import { getUserFromSession } from "@/lib/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Axolotl - 404 Not Found"
};

async function getCurrentUser() {
  const { data: currentUser, error: currentUserError } =
    await getUserFromSession();

  if (currentUserError) return null;

  return currentUser;
}

async function NotFound() {
  const data = await getCurrentUser();
  const userRole = data?.role?.toLowerCase() as keyof typeof roleHomepage;

  const roleHomepage: {
    [key in "nurse" | "midwife" | "patient" | "admin"]: string;
  } = {
    nurse: "/caregiver",
    midwife: "/caregiver",
    patient: "/patient",
    admin: "/admin"
  };

  const homepageLink = ["nurse", "midwife", "patient", "admin"].includes(
    userRole
  )
    ? roleHomepage[userRole]
    : "/";

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-5 text-center">
      <h1 className="text-heading-1 font-bold">404 Not Found</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-heading-6 font-medium">
          The page you are looking for does not exist.
        </h2>
        <p className="text-lg">Please check the URL and try again.</p>
        <Link href={homepageLink} passHref>
          <AxolotlButton
            label="Let's go back to your Homepage"
            variant="primary"
          />
        </Link>
      </div>

      <Image
        src={"/images/freepik/404.svg"}
        width={750}
        height={500}
        alt="404 Not Found"
      />
    </div>
  );
}

export default NotFound;
