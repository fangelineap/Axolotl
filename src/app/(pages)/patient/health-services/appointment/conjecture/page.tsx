"use client";

import Accordion from "@/components/Axolotl/Accordion";
import DisabledLabel from "@/components/Axolotl/DisabledLabel";
import SelectHorizontal from "@/components/Axolotl/SelectHorizontal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  IconAlertCircleFilled,
  IconCircleMinus,
  IconCirclePlus,
  IconCirclePlusFilled,
  IconCircleX,
  IconCircleXFilled,
  IconX,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const Conjecture = () => {
  const [concern, setConcern] = useState<string>("");
  const [selectedAll, setSelectedAll] = useState<string[]>([]);
  const [days, setDays] = useState<number>(0);

  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(3600);

  const [copied, setCopied] = useState(false);

  const symptoms: string[] = [
    "sakit hati",
    "sakit punggung",
    "sakit kepala",
    "sakit a",
    "sakit b",
    "sakit c",
    "sakit d",
    "sakit e",
    "sakit f",
    "sakit g",
    "sakit h",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      () => clearInterval(interval as NodeJS.Timeout);
    }

    return () => clearInterval(interval as NodeJS.Timeout);
  }, [isActive, seconds]);

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center">
        {/* Stepper */}
        <div className="mb-3.5 flex items-center justify-center">
          <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
                1
              </h2>
              <h2>Place an Order</h2>
            </div>
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
                2
              </h2>
              <h2>Conjecture</h2>
            </div>
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
                3
              </h2>
              <h2>Additional</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 flex w-[85%] flex-col justify-between lg:flex-row">
          {/* Left Side */}
          <div className="w-[100%] p-3 lg:mr-7 lg:w-[50%]">
            <h1 className="mb-5 text-2xl font-bold">Diagnosis Conjecture</h1>
            {/* Patient Information Section */}
            <>
              <h1 className="mb-2 text-lg font-semibold">
                Based on your symptoms
              </h1>
              <h1>Symptoms</h1>
              <div className="px-5 py-2">
                <ul className="list-disc">
                  <div className="grid grid-flow-col grid-rows-9 gap-1">
                    {symptoms.map((symptom) => (
                      <li key={symptom}>{symptom}</li>
                    ))}
                  </div>
                </ul>
              </div>

              <div className="mt-5 w-full rounded-md border border-primary">
                <div className="flex justify-center bg-kalbe-light p-3 text-lg font-semibold text-white">
                  <h1>We presume that you might have</h1>
                </div>
                <h1 className="py-5 text-center font-semibold text-primary">
                  Lack of Money
                </h1>
              </div>
            </>
          </div>

          {/* Right Side */}
          <div className="w-[100%] border-stroke lg:w-[50%]">
            <div className="flex flex-col items-center justify-center gap-y-2 rounded-md border border-yellow-dark bg-orange-100 p-7 text-yellow-dark">
              <IconAlertCircleFilled color="#F09D30" size={100} />
              <h1 className="mb-3 text-center text-2xl font-bold">
                !! CAUTION !!
              </h1>
              <ul className="flex list-disc flex-col">
                <li>
                  This conjecture is not a{" "}
                  <span className="font-semibold">final diagnosis</span>
                </li>
                <li>
                  This conjecture <span className="font-semibold">may not</span>{" "}
                  fully align with your{" "}
                  <span className="font-semibold">final diagnosis</span>
                </li>
                <li>
                  <span className="font-semibold">
                    Do not take any medications
                  </span>{" "}
                  before receiving a{" "}
                  <span className="font-semibold">final diagnosis</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-end mt-5">
              <button className="w-1/3 rounded-[7px] bg-primary h-11 p-[8px] text-lg font-semibold text-white hover:bg-opacity-90">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Conjecture;
