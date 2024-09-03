import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface DownloadLicensesProps {
  licenseTitle: string;
  fileLink: string;
  cv?: boolean;
  degree_certificate?: boolean;
  str?: boolean;
  sip?: boolean;
}

const DownloadLicenses = ({
  licenseTitle,
  fileLink,
  cv,
  degree_certificate,
  str,
  sip,
}: DownloadLicensesProps) => {
  const cv_link = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/${fileLink}`;
  const degree_certificate_link = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/degree_certificate/${fileLink}`;
  const str_link = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/str/${fileLink}`;
  const sip_link = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sip/${fileLink}`;

  return (
    <Link
      href={
        cv
          ? cv_link
          : degree_certificate
            ? degree_certificate_link
            : str
              ? str_link
              : sip
                ? sip_link
                : fileLink
      }
      target="_blank"
      rel="noopener noreferrer"
      passHref
    >
      <div className=" flex items-center justify-between gap-2 rounded-[5px] bg-primary px-4 py-2 text-white">
        <h1 className="truncate-text truncate font-bold">{licenseTitle}</h1>
        <IconDownload />
      </div>
    </Link>
  );
};

export default DownloadLicenses;
