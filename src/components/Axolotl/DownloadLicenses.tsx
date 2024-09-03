import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface DownloadLicensesProps {
  licenseTitle: string;
  downloadLink: string;
}

const DownloadLicenses = ({
  licenseTitle,
  downloadLink,
}: DownloadLicensesProps) => {
  return (
    <Link href={downloadLink}>
      <div className=" flex items-center justify-between rounded-[5px] bg-primary px-4 py-2 text-white">
        <h1 className="font-bold">{licenseTitle}</h1>
        <IconDownload />
      </div>
    </Link>
  );
};

export default DownloadLicenses;
