import ButtonDefault from "@/components/Buttons/ButtonDefault";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import React from "react";

const Home = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-8 flex justify-center lg:mb-0 lg:flex-1 lg:justify-start">
            <Image
              src="/images/freepik/ortunsuster.svg"
              alt="Illustration of healthcare professional"
              width={635}
              height={635}
              className=" rounded-lg"
              priority
            />
          </div>
          <div className="text-center lg:max-w-lg lg:flex-1 lg:text-right">
            <div className="mb-6">
              <h1 className="text-3xl font-normal md:text-4xl">Your Health</h1>
              <h2 className="text-5xl font-bold md:text-6xl lg:text-7xl">
                IS OUR PRIORITY
              </h2>
            </div>
            <p className="mb-4 text-xl md:text-2xl lg:text-3xl">
              Axolotl delivers your healthcare solution right to your doorstep.
            </p>
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-end lg:space-x-4 lg:space-y-0">
              <ButtonDefault
                label="Get Started"
                link="/get-started"
                customClasses="bg-kalbe-light text-white py-2 px-4 rounded hover:bg-kalbe-medium"
              />
              <ButtonDefault
                label="Get in touch"
                link="/get-in-touch"
                customClasses="bg-transparent border border-kalbe-light text-kalbe-light py-2 px-4 rounded hover:text-kalbe-medium hover:border-kalbe-medium"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-12">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="mb-8 text-center">
            <div className="flex flex-wrap justify-center space-x-4 text-lg font-medium text-gray-600 md:space-x-8">
              {[
                "Nurses",
                "Midwives",
                "Neonatal Care",
                "Elderly Care",
                "After Care",
              ].map((item, index) => (
                <React.Fragment key={item}>
                  {index > 0 && <span className="hidden md:inline">•</span>}
                  <div className="hover:text-gray-900">{item}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <blockquote className="text-10xl mt-10 font-bold md:text-4xl">
              &quot;Wherever the art of medicine is loved, there is also a love
              of humanity.&quot;
            </blockquote>
            <cite className="mt-2 block">
              —Hippocrates, Father of Modern Medicine
            </cite>
          </div>
        </div>
      </div>
      <div className="py-12">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            <div className="flex-initial lg:order-2 lg:ml-10">
              <Image
                src="/images/freepik/testimonial.svg"
                alt="Testimonial"
                width={600}
                height={400}
                className="h-auto w-full rounded-lg"
              />
            </div>
            <div className="w-full lg:order-1 lg:w-1/2">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-normal text-dark sm:text-7xl">
                  To <span className="font-bold">Improve Health</span> for
                  a&nbsp;
                  <span className="font-bold">Better Life</span>
                </h3>
                <p className="mt-4 text-center text-xl">
                  &quot;Axolotl&apos;s home care services have been a lifeline
                  for my family. Their compassionate caregivers made all the
                  difference in ensuring my father&apos;s comfort and well-being
                  at home. I can&apos;t thank them enough.&quot;
                </p>
                <p className="mt-2 text-right text-lg">
                  - Claire, Denpasar City
                </p>
                <a
                  href=""
                  className="mt-4 inline-block text-kalbe-light hover:text-kalbe-medium"
                >
                  Read our patients journey →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h4 className="text-5xl font-bold">
              We can <span className="font-extrabold text-dark-2">Help</span>{" "}
              you with
            </h4>
            <div className="mt-8 flex flex-wrap justify-center">
              {[
                {
                  src: "/images/freepik/neonatal-care.svg",
                  text: "Neonatal Care",
                },
                {
                  src: "/images/freepik/elderly-care.svg",
                  text: "Elderly Care",
                },
                { src: "/images/freepik/after-care.svg", text: "After Care" },
                { src: "/images/freepik/booster.svg", text: "Booster" },
              ].map((service, index) => (
                <div key={index} className="m-4 flex flex-col items-center">
                  <Image
                    src={service.src}
                    alt={service.text}
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
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
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-6">
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
                <div>
                  <Image
                    src="/images/freepik/location.svg"
                    alt="Axolotl Location"
                    width={500}
                    height={500}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <div className="md:col-span-2">
                <h2 className="text-right text-4xl font-extrabold text-dark-2">
                  It saves your time!
                </h2>
                <p className="mt-4 text-right text-xl">
                  Axolotl AI will help you describe your problems to the&nbsp;
                  <span className="font-extrabold text-dark-2">Caregiver</span>
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

      <div className="py-12">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-normal md:text-4xl">
              Are you a <span className="font-bold">Caregiver?</span>
            </h2>
            <p className="mt-4 text-xl">
              Let&apos;s create a healthier future together with Axolotl!
            </p>
            <div className="mt-6 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <ButtonDefault
                label="Apply as Caregiver"
                link=""
                customClasses="bg-kalbe-light text-white py-2 px-4 rounded hover:bg-kalbe-medium"
              />
              <a
                href=""
                className="flex items-center text-kalbe-light hover:text-kalbe-medium"
              >
                More Information →
              </a>
            </div>
            <div className="mt-8 flex justify-center">
              <Image
                src="/images/freepik/health-teams.svg"
                alt="Health Professional Teams"
                width={400}
                height={267}
                className="h-auto w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
