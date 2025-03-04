import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import Image from "next/image";

export const metadata = getGuestMetadata("about");

const About = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-8 text-left text-5xl text-black">
          The Story of <span className="font-bold">Axolotl</span>
        </h1>
        <div className="space-y-10 text-black">
          <div className="flex flex-col items-center md:flex-row">
            <Image
              src="/images/freepik/surgery-care.svg"
              alt="Surgery Care"
              width={300}
              height={300}
            />
            <p className="mt-4 text-center text-lg md:ml-12 md:mt-0 md:text-left">
              Hi folks! Imagine this is you after getting surgery and you need
              some aftercare at your house, but you can&apos;t walk at all 😢
            </p>
          </div>
          <div className="flex flex-col items-center md:flex-row">
            <Image
              src="/images/freepik/wheel-chair.svg"
              alt="Wheel Chair"
              width={300}
              height={300}
            />
            <p className="mt-4 text-center text-lg md:ml-12 md:mt-0 md:text-left">
              Or you probably have an elderly who needs some periodic care at
              your home
            </p>
          </div>
          <div className="flex flex-col items-center md:flex-row">
            <Image
              src="/images/freepik/labor.svg"
              alt="labor"
              width={300}
              height={300}
            />
            <p className="mt-4 text-center text-lg md:ml-12 md:mt-0 md:text-left">
              Or it was your wife who needs some help taking care of your baby
              in the first week after her labour
            </p>
          </div>
          <div className="flex flex-col items-center md:flex-row">
            <Image
              src="/images/freepik/question-mark.svg"
              alt="Question Mark"
              width={300}
              height={300}
            />
            <p className="mt-4 text-center text-lg md:ml-12 md:mt-0 md:text-left">
              However, you couldn&apos;t find any caregiver that could help
              right at your house! Or you can&apos;t describe the symptoms that
              you experienced to them 🤔<span className="text-red-600">?</span>
            </p>
          </div>
          <div className="flex flex-col items-center md:flex-row">
            <Image
              src="/images/freepik/acquaintance-care.svg"
              alt="Acquaintance Care"
              width={300}
              height={300}
            />
            <p className="mt-4 text-center text-lg md:ml-12 md:mt-0 md:text-left">
              You might have an acquaintance to help you find the caregiver or
              they might be the one. <br /> <br />
              But have you ever thought about their legality? Or whenever you go
              to a new city and don&apos;t know anyone? And when do you need to
              send a caregiver to your parents in other cities?
            </p>
          </div>
          <div className="flex flex-col items-center md:flex-row">
            <Image
              src="/images/freepik/axolotl-help.svg"
              alt="Axolotl Help"
              width={300}
              height={300}
            />
            <p className="mt-4 text-center text-lg md:ml-12 md:mt-0 md:text-left">
              Well, I think you start to question these circumstances and to
              answer your questions, that&apos;s where Axolotl comes in. <br />{" "}
              <br />
              We&apos;re addressing these concerns and trying to bring back
              features that help the caregiver which will cut your waiting time!
            </p>
          </div>
          <div className="flex flex-col items-center md:flex-row">
            <div className="w-full md:w-auto">
              <iframe
                className="rounded-lg"
                width="300"
                height="200"
                src="https://www.youtube.com/embed/uUw4NJmAUNI?si=syqClaDEecFtKjCZ"
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </div>
            <p className="mt-4 text-center text-lg md:ml-12 md:mt-0 md:text-left">
              Why Axolotl? Just hit and listen to this video <br /> <br />
              You see, it&apos;s widely known for its ability to regenerate lost
              limbs, we want you to believe that you also have the great power
              to heal and improve your health. <br /> <br />
              Let Axolotl be your guide to get yourself healthy as soon as
              possible 🥰
            </p>
          </div>
          <div className="block w-full border-t border-primary md:hidden" />
          <div className="flex flex-col items-center">
            <blockquote className="text-center text-lg md:text-3xl">
              “The eyes of the axolotls spoke to me of the presence of a
              different life, of another way of seeing.”
              <br />
              <span className="text-md mt-2 block w-full text-right md:text-lg">
                —Julio Cortázar,&nbsp;
                <a
                  href="https://www.goodreads.com/work/quotes/21981414-axolotl-la-presencia-de-una-vida-diferente-de-otra-forma-de-mirar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-kalbe-light"
                >
                  Axolotl
                </a>
              </span>
            </blockquote>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default About;
