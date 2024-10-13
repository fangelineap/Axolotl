import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";

interface DownloadLicensesProps {
  licenseTitle: string;
  fileLink: string;
  licenseType: "CV" | "Degree Cretificate" | "STR" | "SIP";
}

const DownloadLicenses = ({
  licenseTitle,
  fileLink,
  licenseType
}: DownloadLicensesProps) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

  const cv_link = `${baseUrl}/cv/${fileLink}`;
  const degree_certificate_link = `${baseUrl}/degree_certificate/${fileLink}`;
  const str_link = `${baseUrl}/str/${fileLink}`;
  const sip_link = `${baseUrl}/sip/${fileLink}`;

  const getFileLink = () => {
    switch (licenseType) {
      case "CV":
        return cv_link;
      case "Degree Cretificate":
        return degree_certificate_link;
      case "STR":
        return str_link;
      case "SIP":
        return sip_link;
      default:
        throw new Error(`Unknown license type: ${licenseType}`);
    }
  };

  const href = getFileLink();

  return (
    <Link href={href!} target="_blank" rel="noopener noreferrer" passHref>
      <button className="flex w-full items-center justify-between gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-kalbe-ultraLight hover:text-primary">
        <h1 className="max-w-xs truncate font-bold">{licenseTitle}</h1>
        <IconDownload />
      </button>
    </Link>
  );
};

export default DownloadLicenses;
