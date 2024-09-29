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
  sip
}: DownloadLicensesProps) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

  const cv_link = `${baseUrl}/cv/${fileLink}`;
  const degree_certificate_link = `${baseUrl}/degree_certificate/${fileLink}`;
  const str_link = `${baseUrl}/str/${fileLink}`;
  const sip_link = `${baseUrl}/sip/${fileLink}`;

  const getFileLink = () => {
    if (cv) {
      return cv_link;
    }
    if (degree_certificate) {
      return degree_certificate_link;
    }
    if (str) {
      return str_link;
    }
    if (sip) {
      return sip_link;
    }
  };

  const href = getFileLink();

  return (
    <Link href={href!} target="_blank" rel="noopener noreferrer" passHref>
      <button className="flex w-full items-center justify-between gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-white hover:bg-kalbe-ultraLight hover:text-primary">
        <h1 className="max-w-xs truncate font-bold">{licenseTitle}</h1>
        <IconDownload />
      </button>
    </Link>
  );
};

export default DownloadLicenses;
