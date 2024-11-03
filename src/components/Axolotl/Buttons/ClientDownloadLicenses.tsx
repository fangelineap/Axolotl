"use client";

import { getServerPrivateStorageURL } from "@/app/_server-action/global/storage/server";
import { Skeleton } from "@mui/material";
import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AxolotlButton from "./AxolotlButton";
import { toast } from "react-toastify";

interface ClientDownloadLicensesProps {
  licenseTitle: string;
  fileLink: string;
  licenseType: "CV" | "Degree Certificate" | "STR" | "SIP";
}

function ClientDownloadLicenses({
  licenseTitle,
  fileLink,
  licenseType
}: ClientDownloadLicensesProps) {
  const [publicURL, setPublicURL] = useState<string | null>(null);

  useEffect(() => {
    const getLicenseURL = async () => {
      try {
        const licenseSource = {
          CV: "cv",
          "Degree Certificate": "degree_certificate",
          STR: "str",
          SIP: "sip"
        };
        const url = await getServerPrivateStorageURL(
          licenseSource[licenseType],
          fileLink
        );
        setPublicURL(url);
      } catch (error) {
        console.error("Error fetching the URL:", error);
      }
    };

    getLicenseURL();
  }, [fileLink, licenseType]);

  if (fileLink === "") {
    return (
      <AxolotlButton
        variant="secondary"
        label={licenseTitle}
        fontThickness="medium"
        customClasses="justify-between"
        endIcon={<IconDownload />}
        onClick={() =>
          toast.info(
            `Looking for ${licenseType}? Guess it's still out there... patience is key! Wait for them to upload it 👌`,
            {
              position: "bottom-right"
            }
          )
        }
      />
    );
  }

  return (
    <>
      {!publicURL && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          className="w-full rounded-md"
          height={40}
        />
      )}

      {publicURL && (
        <Link
          href={publicURL!}
          target="_blank"
          rel="noopener noreferrer"
          passHref
        >
          <AxolotlButton
            variant="primary"
            label={licenseTitle}
            fontThickness="medium"
            customClasses="justify-between"
            endIcon={<IconDownload />}
          />
        </Link>
      )}
    </>
  );
}

export default ClientDownloadLicenses;
