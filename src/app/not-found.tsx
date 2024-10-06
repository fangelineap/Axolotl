import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Axolotl - 404 Not Found"
};

function NotFound() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-5 text-center">
      <h1 className="text-heading-1 font-bold">404 Not Found</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-heading-6 font-medium">
          The page you are looking for does not exist.
        </h2>
        <p className="text-lg">Please check the URL and try again.</p>
        <Link href="/" passHref>
          <button className="rounded border border-primary bg-primary px-3 py-2 text-center font-bold text-white hover:bg-kalbe-ultraLight hover:text-primary">
            Let&apos;s go back to Home
          </button>
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
