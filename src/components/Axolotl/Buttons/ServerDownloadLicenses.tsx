import { getServerPrivateStorageURL } from "@/app/_server-action/storage/server";
import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";
import AxolotlButton from "./AxolotlButton";

interface ServerDownloadLicensesProps {
  licenseTitle: string;
  fileLink: string;
  licenseType: "CV" | "Degree Certificate" | "STR" | "SIP";
}

async function getLicenseURL(licenseType: string, fileLink: string) {
  const publicURL = await getServerPrivateStorageURL(licenseType, fileLink);

  if (!publicURL) {
    return null;
  }

  return publicURL;
}

async function ServerDownloadLicenses({
  licenseTitle,
  fileLink,
  licenseType
}: ServerDownloadLicensesProps) {
  const licenseSource = {
    CV: "cv",
    "Degree Certificate": "degree_certificate",
    STR: "str",
    SIP: "sip"
  };

  const publicURL = await getLicenseURL(licenseSource[licenseType], fileLink);

  return (
    <Link href={publicURL!} target="_blank" rel="noopener noreferrer" passHref>
      <AxolotlButton
        variant="primary"
        label={licenseTitle}
        fontThickness="medium"
        customClasses="justify-between"
        endIcon={<IconDownload />}
      />
    </Link>
  );
}

export default ServerDownloadLicenses;
