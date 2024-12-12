import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AxolotlButton from "../Buttons/AxolotlButton";

const GuestPage = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col gap-2 md:mx-10 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="flex items-center justify-center">
            <Image
              src="/images/freepik/ortunsuster.svg"
              alt="Illustration of healthcare professional"
              width={500}
              height={500}
              priority
              className="block md:hidden lg:block"
            />
          </div>
          <div className="flex flex-col gap-4 text-center lg:max-w-lg lg:flex-1 lg:text-right">
            <div className="w-full">
              <h1 className="text-3xl font-normal md:text-4xl">Your Health</h1>
              <h2 className="text-5xl font-bold md:text-6xl lg:text-7xl">
                IS OUR PRIORITY
              </h2>
            </div>
            <div className="flex w-full items-center justify-end">
              <p className="text-xl md:text-2xl">
                Axolotl delivers your healthcare solution right to your doorstep
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row lg:justify-end">
              <Link href="/auth/signin" className="w-full md:w-fit">
                <AxolotlButton
                  label="Get Started"
                  variant="primary"
                  roundType="regular"
                />
              </Link>
              <Link href="/guest/about" className="w-full md:w-fit">
                <AxolotlButton
                  label="Read our story"
                  variant="primaryOutlined"
                  endIcon={<IconArrowRight size={20} stroke={1.5} />}
                  roundType="regular"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5 md:pb-12">
        <div className="container mx-auto flex flex-col gap-8 px-6 lg:px-10">
          <div className="hidden flex-wrap items-center justify-center gap-4 text-center text-xl font-medium md:flex md:gap-4">
            {[
              "Nurses",
              "Midwives",
              "Neonatal Care",
              "Elderly Care",
              "After Care"
            ].map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <span className="hidden md:inline">•</span>}
                <p>{item}</p>
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-5 md:gap-10">
            <div className="flex flex-col gap-2">
              <blockquote className="text-center text-xl font-bold md:text-heading-2">
                &quot;Wherever the art of medicine is loved, there is also a
                love of humanity.&quot;
              </blockquote>
              <cite className="text-md block text-end font-normal md:text-lg">
                —Hippocrates, Father of Modern Medicine
              </cite>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                src={"/images/illustration/axolotl-regeneration.svg"}
                alt="Axolotl Regeneration"
                width={500}
                height={500}
                className="h-auto w-full md:h-3/4 md:w-3/4"
              />
              <p className="w-2xl text-center lg:w-full lg:text-xl">
                With the regeneration ability from{" "}
                <span className="font-medium text-primary">
                  Axolotl (Ambystoma mexicanum)
                </span>
                , we have an ambition
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:pb-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center gap-5 md:gap-10 lg:flex-row">
            <Image
              src="/images/freepik/testimonial.svg"
              alt="Testimonial"
              width={600}
              height={400}
              className="h-auto w-3/4 rounded-lg lg:order-2 lg:h-1/2 lg:w-1/2"
            />
            <div className="w-full lg:order-1 lg:w-1/2">
              <div className="text-center lg:text-left">
                <h3 className="text-heading-5 font-normal text-dark md:text-heading-1">
                  To <span className="font-bold">Improve Health</span> <br />{" "}
                  for a&nbsp;
                  <span className="font-bold">Better Life</span>
                </h3>
                <p className="mt-4 text-center lg:text-xl">
                  &quot;Axolotl&apos;s home care services have been a lifeline
                  for my family. Their compassionate caregivers made all the
                  difference in ensuring my father&apos;s comfort and well-being
                  at home. I can&apos;t thank them enough.&quot;
                </p>
                <p className="mt-2 text-right lg:text-lg">
                  - Claire, Denpasar City
                </p>
                <Link
                  href="/guest/about"
                  className="mt-4 flex items-center justify-center gap-2 text-kalbe-light hover:underline md:justify-start"
                >
                  Read our journey <IconArrowRight />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <h4 className="text-heading-5 lg:text-heading-1">
              We can <span className="font-bold text-dark-2">Help</span> you
              with
            </h4>
            <div className="mt-8 flex justify-center">
              <div className="mx-auto grid grid-cols-2 items-center justify-center gap-4 md:flex">
                {[
                  {
                    src: "/images/freepik/Neonatal Care.svg",
                    text: "Neonatal Care"
                  },
                  {
                    src: "/images/freepik/Elderly Care.svg",
                    text: "Elderly Care"
                  },
                  { src: "/images/freepik/After Care.svg", text: "After Care" },
                  { src: "/images/freepik/Booster.svg", text: "Booster" }
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-between gap-5 rounded-lg border p-5"
                  >
                    <Image
                      src={service.src}
                      alt={service.text}
                      className="max-h-50"
                      width={200}
                      height={200}
                    />
                    <h1 className="text-xl md:text-heading-6">
                      {service.text}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 md:pb-12">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid gap-15 lg:grid-cols-2">
            <div className="grid gap-6">
              <div>
                <Image
                  src="/images/freepik/patient-waiting.svg"
                  alt="Patient Waiting"
                  width={500}
                  height={500}
                  className="h-auto w-full"
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
                <div className="flex flex-col items-center justify-center gap-5">
                  <div>
                    <Image
                      src="/images/freepik/patient-helped.svg"
                      alt="Patient Helped"
                      width={500}
                      height={500}
                      className="h-auto w-full"
                    />
                  </div>
                  <div>
                    <Image
                      src="/images/freepik/patient-saved.svg"
                      alt="Patient Saved"
                      width={500}
                      height={500}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
                <div className="max-h-40 max-w-40 lg:max-h-full lg:max-w-full">
                  <Image
                    src="/images/freepik/location.svg"
                    alt="Axolotl Location"
                    width={500}
                    height={500}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <div className="md:col-span-2">
                <h2 className="text-center text-4xl font-bold text-dark-2 md:text-right">
                  It saves your time!
                </h2>
                <p className="my-4 text-center text-xl md:text-right">
                  Axolotl AI will help you describe your problems to the&nbsp;
                  <span className="font-bold text-dark-2">Caregiver</span>
                </p>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <Image
                  src="/images/freepik/axolotl-ai.svg"
                  alt="Axolotl AI"
                  width={500}
                  height={500}
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 md:pt-0">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-normal md:text-4xl">
              Are you a <span className="font-bold">Caregiver?</span>
            </h2>
            <p className="mt-4 text-xl">
              Let&apos;s create a healthier future together with Axolotl!
            </p>
            <div className="mt-6 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Link href="/guest/careers">
                <AxolotlButton
                  label="Apply as Caregiver"
                  roundType="regular"
                  variant="primary"
                  fontThickness="medium"
                />
              </Link>
              <Link
                href="/guest/careers"
                className="flex items-center gap-2 text-kalbe-light transition duration-150 ease-in-out hover:underline"
              >
                More Information <IconArrowRight />
              </Link>
            </div>
            <div className="mt-8 flex justify-center">
              <Image
                src="/images/freepik/health-teams.svg"
                alt="Health Professional Teams"
                width={200}
                height={67}
                className="h-auto w-full md:w-1/2"
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default GuestPage;
