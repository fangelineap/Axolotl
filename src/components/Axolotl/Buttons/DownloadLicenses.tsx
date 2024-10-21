import { getClientPublicStorageURL } from "@/app/_server-action/storage";
import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";

interface DownloadLicensesProps {
  licenseTitle: string;
  fileLink: string;
  licenseType: "CV" | "Degree Certificate" | "STR" | "SIP";
}

const DownloadLicenses = ({
  licenseTitle,
  fileLink,
  licenseType
}: DownloadLicensesProps) => {
  const licenseSource = {
    CV: "cv",
    "Degree Certificate": "degree_certificate",
    STR: "str",
    SIP: "sip"
  };

  const publicURL = getClientPublicStorageURL(
    licenseSource[licenseType],
    fileLink
  );

  return (
    <Link href={publicURL} target="_blank" rel="noopener noreferrer" passHref>
      <button className="flex w-full items-center justify-between gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-kalbe-ultraLight hover:text-primary">
        <h1 className="max-w-xs truncate font-bold">{licenseTitle}</h1>
        <IconDownload />
      </button>
    </Link>
  );
};

export default DownloadLicenses;
