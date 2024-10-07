import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { IconChevronsDown, IconInfoCircleFilled } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = getGuestMetadata("careers");

const Careers: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center p-6 text-black md:relative md:h-screen">
        <div className="custom-bg absolute inset-0"></div>

        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="mb-4 text-heading-3 md:text-heading-2">How to be</h1>
          <h2 className="mb-6 text-heading-2 md:text-heading-1">
            a <span className="font-bold">Caregiver</span>
          </h2>
          <p className="mb-8 text-lg md:text-xl">
            Join a team dedicated to providing compassionate care and support to
            those who need it most. As a caregiver, you&apos;ll play a vital
            role in enhancing the lives of individuals and families, fostering
            independence, and promoting overall well-being.
          </p>

          <Link
            href={"/auth/register"}
            className="flex items-center justify-center gap-2"
          >
            <AxolotlButton
              label="Apply Now"
              variant="primary"
              roundType="regular"
              fontThickness="medium"
              customClasses="text-xl md:text-heading-6 md:w-fit"
              startIcon={<IconChevronsDown />}
              endIcon={<IconChevronsDown />}
            />
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center p-6 text-black md:mb-12 md:flex-row">
        <Image
          src="/images/freepik/caregiver-team.svg"
          alt="Caregiver Team"
          width={300}
          height={300}
          className="hidden md:mb-0 md:mr-6 md:block"
        />
        <div className="text-center md:text-right">
          <h1 className=" mb-7 text-4xl">
            About <span className="font-bold">Caregiver</span>
          </h1>
          <p className="text-lg">
            As a Caregiver, you are the heart of our compassionate care team,
            dedicated to enhancing the quality of life for our clients. Your
            primary responsibility is to provide personalized care and support
            tailored to the unique needs of each individual.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6 text-black">
        <div className="container mx-auto rounded-lg border border-kalbe-light bg-kalbe-ultraLight p-6">
          <div className="flex flex-col md:flex-row">
            <div className="w-full border-b border-kalbe-light p-4 md:w-1/2 md:border-b-0 md:border-r">
              <h2 className="mb-4 text-2xl">
                As a <span className="font-bold">Caregiver</span>, you&apos;ll
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>
                  Assist with activities of daily living such as{" "}
                  <strong>
                    bathing, dressing, grooming, toileting, and mobility
                  </strong>
                  .
                </li>
                <li>
                  Provide comprehensive care to{" "}
                  <strong>women after childbirth</strong>, including monitoring
                  recovery, breastfeeding support, family planning counseling,
                  and addressing any physical or emotional concerns.
                </li>
                <li>
                  Ensure <strong>timely medication</strong> administration and
                  adherence to prescribed dosages.
                </li>
                <li>
                  <strong>Monitor client&apos;s well-being</strong>, noting any
                  changes in physical or mental condition and reporting concerns
                  to the appropriate parties.
                </li>
              </ul>
            </div>
            <div className="w-full p-4 md:w-1/2">
              <h2 className="mb-4 text-2xl">
                Your <span className="font-bold">Requirements</span> are
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>
                  Bachelor&apos;s or Diploma&apos;s degree in{" "}
                  <strong>Nursing or Midwifery</strong> from an accredited
                  institution.
                </li>
                <li>
                  Must have the following administrations:
                  <ul className="list-disc pl-5">
                    <li>Surat Izin Praktik (SIP)</li>
                    <li>Surat Tanda Registrasi (STR)</li>
                    <li>CV/Resume</li>
                  </ul>
                </li>
                <li>
                  Prior experience in{" "}
                  <strong>elderly, neonatal, and surgical after care</strong> is
                  preferred.
                </li>
                <li>
                  Excellent communication, interpersonal, and clinical skills;
                  ability to work independently and as part of a team; strong
                  decision-making and critical thinking skills.
                </li>
                <li>
                  Currently living in{" "}
                  <strong>Malang City, East Java or Gianyar City, Bali</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6 text-black">
        <div className="container mx-auto text-center md:text-left">
          <h2 className="mb-6 text-center text-4xl">
            Nice to <span className="font-bold">Have</span>
          </h2>
          <p className="mb-8 text-center text-lg">
            Additional certifications such as Certified Nurse Midwife (CNM) or
            Neonatal Resuscitation Program (NRP)
          </p>
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="flex flex-col items-center text-center md:w-1/2 md:text-left">
              <h2 className="mb-4 text-3xl">
                Start your <span className="font-bold">Journey</span> Now!
              </h2>
              <div className="mb-6 flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-blue bg-blue-light p-4 lg:flex-row">
                <div className="flex-shrink-0">
                  <IconInfoCircleFilled size={50} className="text-blue" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-blue">
                    Quick Tips for Speed Up Your Registration
                  </h3>
                  <ul className="list-disc pl-5 text-left text-sm text-blue">
                    <li>
                      Get all necessary documents before registering yourself as
                      a caregiver.
                    </li>
                    <li>
                      Don&apos;t forget to prepare your CV/Resume as well.
                    </li>
                  </ul>
                </div>
              </div>
              <Link href={"/auth/register"} className="w-full md:w-fit">
                <AxolotlButton
                  label="Apply as Caregiver"
                  variant="primary"
                  roundType="regular"
                  fontThickness="medium"
                />
              </Link>
            </div>
            <div className="hidden md:flex md:justify-center ">
              <Image
                src="/images/freepik/your-journey.svg"
                alt="Your Journey"
                width={400}
                height={300}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Careers;
