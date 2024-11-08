"use client";

import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import { IconCookieManFilled } from "@tabler/icons-react";
import { Metadata } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
  title: "Axolotl is Hungry..."
};

async function clearCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function Error() {
  const router = useRouter();

  const handleClearCookies = async () => {
    await clearCookie("sb-aldbaqcbjyujaoncrhuc-auth-token");

    setTimeout(() => {
      router.refresh();
    }, 250);
  };

  return (
    <div className="mx-20 flex min-h-screen flex-col items-center justify-center gap-5 text-center">
      <h1 className="text-heading-2 font-bold lg:text-heading-1">
        Well, this is embarrassing...
      </h1>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <h2 className="text-heading-6 font-medium">
          Looks like the cookies got a little too toasted 🍪🔥
        </h2>
        <p className="w-1/2 text-lg">
          I know, I know. You came here for a good time, and now you&apos;re
          stuck with a digital cookie monster situation. Let&apos;s not make it
          weird— <span className="underline">just click the button below</span>{" "}
          to let Axolotl eat your cookies.
        </p>
        <p className="text-sm">
          <span className="font-bold">Note:</span> This will log you out of your
          account. If this page doesn&apos;t refresh automatically, please
          refresh the page manually.
        </p>
        <AxolotlButton
          label="Give Axolotl a cookie"
          endIcon={<IconCookieManFilled stroke={1} />}
          variant="primary"
          customWidth
          customClasses="w-fit mt-2"
          onClick={handleClearCookies}
        />
      </div>
      <Image
        src={"/images/freepik/error.svg"}
        width={600}
        height={450}
        alt="Error"
      />
    </div>
  );
}

export default Error;
