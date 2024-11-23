"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CAREGIVER, USER } from "@/types/AxolotlMainType";
import { createSupabaseClient } from "@/lib/client";
import { getGlobalUserProfilePhoto } from "@/app/_server-action/global";
import { Skeleton } from "@mui/material";

type Caregiver = USER & {
  profile_photo_url?: string;
  caregiver: CAREGIVER[];
};

const CaregiverSelection = ({ role }: { role: string }) => {
  const router = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [location, setLocation] = useState<"Malang" | "Bali" | "">("");
  const [caregiver, setCaregiver] = useState<Caregiver[]>([]);
  const [filtered, setFiltered] = useState<Caregiver[]>([]);
  const [rating, setRating] = useState<number[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize:
      filtered.length > 0
        ? Math.ceil(filtered.length / 5)
        : !location && rating.length === 0
          ? Math.ceil(caregiver.length / 5)
          : Math.ceil(filtered.length / 5)
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createSupabaseClient();

      const { data } = await supabase
        .from("users")
        .select("*, caregiver(*)")
        .eq("role", role)
        .eq("caregiver.status", "Verified");

      if (data) {
        const verifiedCg = data.filter((user) => user.caregiver.length > 0);
        const updatedData = await Promise.all(
          verifiedCg.map(async (user: Caregiver) => {
            if (user.caregiver && user.caregiver[0].profile_photo) {
              const url = await getGlobalUserProfilePhoto(
                user.caregiver[0].profile_photo
              );
              user.profile_photo_url = url!;
            }

            return user;
          })
        );

        setCaregiver(updatedData);
        setPagination((prev) => ({
          ...prev,
          pageSize: Math.ceil(data.length / 5)
        }));
        setLoading(false);
      }
    };

    if (role) {
      getUser();
    }
  }, [, role]);

  useEffect(() => {
    let filteredCG: Caregiver[] = [];
    if (rating.length > 0) {
      rating.forEach((rate) => {
        caregiver.forEach((cg) => {
          if (
            cg.caregiver[0].rate &&
            cg.caregiver[0].rate >= rate &&
            cg.caregiver[0].rate <= rate + 1
          ) {
            const index = filteredCG.findIndex((f) => f.id == cg.id);

            if (index == -1) {
              if (cg.address.includes(location)) {
                filteredCG.push(cg);
              }
              // filtered.splice(index, 1);
            }
          }
        });
      });
    } else {
      caregiver.forEach((cg) => {
        const index = filteredCG.findIndex((f) => f.id == cg.id);

        if (index == -1) {
          if (cg.address.includes(location)) {
            filteredCG.push(cg);
          }
        }
      });
    }

    setFiltered(filteredCG);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating, location]);

  return (
    <>
      {/* Content */}
      <div className="mt-6 flex h-[100%] w-[85%] flex-col justify-between gap-7 lg:flex-row">
        <div className="lg:w-[35%]">
          <div className="mb-5 rounded-md border-2 border-primary bg-white">
            <div className="bg-primary p-3">
              <h1 className="text-lg font-semibold text-white">
                Set Your Location
              </h1>
            </div>
            <div className="px-5">
              <div
                onClick={() => {
                  if (location !== "Malang") setLocation("Malang");
                  else setLocation("");
                }}
                className={`mb-5.5 mt-5 flex w-full items-center justify-between gap-7 rounded-[7px] border-[1.5px] p-4 px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary ${location === "Malang" ? "border-kalbe-light bg-green-100" : "border-stroke bg-transparent"} cursor-pointer disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
              >
                <div className="flex items-center justify-start gap-7">
                  <Image
                    width={30}
                    height={30}
                    src={`${location === "Malang" ? "/images/icon/icon-done.svg" : "/images/icon/icon-done-not-filled.svg"}`}
                    className={`rounded-full border ${location === "Malang" ? "bg-kalbe-veryLight" : "bg-white"}`}
                    alt="Checked Logo"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold">
                      Malang City, East Java, Indonesia
                    </h2>
                    <p className="text-dark-secondary">Blimbing area</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  if (location !== "Bali") setLocation("Bali");
                  else setLocation("");
                }}
                className={`mb-5.5 mt-5 flex w-full items-center justify-between gap-7 rounded-[7px] border-[1.5px] p-4 px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary ${location === "Bali" ? "border-kalbe-light bg-green-100" : "border-stroke bg-transparent"} cursor-pointer disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
              >
                <div className="flex items-center justify-start gap-7">
                  <Image
                    width={30}
                    height={30}
                    src={`${location === "Bali" ? "/images/icon/icon-done.svg" : "/images/icon/icon-done-not-filled.svg"}`}
                    className={`rounded-full border ${location === "Bali" ? "bg-kalbe-veryLight" : "bg-white"}`}
                    alt="Checked Logo"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold">
                      Gianyar City, Bali, Indonesia
                    </h2>
                    <p className="text-dark-secondary">Gianyar Area</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border-2 border-primary bg-white">
            <div className="bg-primary p-3">
              <h1 className="text-lg font-semibold text-white">
                Filter Rating
              </h1>
            </div>
            {/* Rating */}
            <div className="px-5 py-2">
              <div className="mb-1 inline-flex w-full items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="checkbox"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
                    id="checkbox"
                    name="rating4to5"
                    onChange={() => {
                      const index = rating.indexOf(4);
                      if (index === -1) {
                        setRating((prev) => [...prev, 4]);
                      } else {
                        setRating((prev) => prev.filter((i) => i !== 4));
                      }
                    }}
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <label htmlFor="Rating4to5" className="flex gap-2">
                  <Image
                    src="/images/logo/star.svg"
                    height={20}
                    width={20}
                    alt="Star Logo"
                  />
                  <span>4 - 5 stars</span>
                </label>
              </div>
              <div className="mb-1 inline-flex w-full items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="checkbox"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
                    id="checkbox"
                    name="rating3to4"
                    onChange={() => {
                      const index = rating.indexOf(3);
                      if (index === -1) {
                        setRating((prev) => [...prev, 3]);
                      } else {
                        setRating((prev) => prev.filter((i) => i !== 3));
                      }
                    }}
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <label htmlFor="Rating4to5" className="flex gap-2">
                  <Image
                    src="/images/logo/star.svg"
                    height={20}
                    width={20}
                    alt="Star Logo"
                  />
                  <span>3 - 4 stars</span>
                </label>
              </div>
              <div className="mb-1 inline-flex w-full items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="checkbox"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
                    id="checkbox"
                    name="rating2to3"
                    onChange={() => {
                      const index = rating.indexOf(2);
                      if (index === -1) {
                        setRating((prev) => [...prev, 2]);
                      } else {
                        setRating((prev) => prev.filter((i) => i !== 2));
                      }
                    }}
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <label htmlFor="Rating4to5" className="flex gap-2">
                  <Image
                    src="/images/logo/star.svg"
                    height={20}
                    width={20}
                    alt="Star Logo"
                  />
                  <span>2 - 3 stars</span>
                </label>
              </div>
              <div className="inline-flex w-full items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="checkbox"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
                    id="checkbox"
                    name="rating1to2"
                    onChange={() => {
                      const index = rating.indexOf(1);
                      if (index === -1) {
                        setRating((prev) => [...prev, 1]);
                      } else {
                        setRating((prev) => prev.filter((i) => i !== 1));
                      }
                    }}
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <label htmlFor="Rating4to5" className="flex gap-2">
                  <Image
                    src="/images/logo/star.svg"
                    height={20}
                    width={20}
                    alt="Star Logo"
                  />
                  <span>1 - 2 stars</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-[65%]">
          <h1 className="p-3 text-lg font-semibold">Choose Your Caregiver</h1>
          <div className="px-3">
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                animation="wave"
                height={300}
                className="rounded-lg"
              />
            ) : rating.length > 0 || location ? (
              filtered.length > 0 ? (
                filtered?.map((cg, index) => (
                  <div
                    key={index}
                    className="mb-5 flex w-full items-center justify-between gap-5 rounded-md border border-primary p-3"
                  >
                    <div className="flex h-[100%] w-[100%] items-center gap-5 lg:mr-10 lg:gap-10">
                      <div className="min-w-[100px]">
                        <Image
                          src={
                            cg.profile_photo_url ||
                            "/images/user/Default Caregiver Photo.png"
                          }
                          height={100}
                          width={100}
                          className="h-[100px] w-[100px] rounded-full object-cover"
                          alt="CG pfp"
                        />
                      </div>
                      <div className="flex w-full items-center gap-5">
                        <div className="w-[70%]">
                          <h1 className="mb-2 font-semibold">
                            {cg.first_name + " " + cg.last_name}
                            {/* Strawberry Shortcake, A.Md.Kep. */}
                          </h1>
                          <div className="mb-2 flex gap-2">
                            <Image
                              src="/images/logo/building.svg"
                              height={20}
                              width={20}
                              alt="Building Logo"
                            />
                            <h1 className="text-sm text-dark-secondary">
                              {cg.caregiver[0].workplace}
                            </h1>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex gap-2">
                              <Image
                                src="/images/logo/briefcase.svg"
                                height={20}
                                width={20}
                                alt="Briefcase Logo"
                              />
                              <h1 className="text-sm text-dark-secondary">
                                {cg.caregiver[0].work_experiences + " years"}
                              </h1>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image
                                src="/images/logo/star.svg"
                                height={20}
                                width={20}
                                alt="Star Logo"
                              />
                              <h1 className="text-sm text-dark-secondary">
                                {cg.caregiver[0].rate?.toFixed(1) || "-"}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="h-25 w-[0.5px] bg-primary"></div>
                        <div className="flex w-[30%] justify-end">
                          <button
                            onClick={() =>
                              router.push(
                                `/patient/health-services/appointment?caregiver=${cg.user_id}`
                              )
                            }
                            className="rounded-sm bg-primary px-3 py-1 font-semibold text-white hover:bg-opacity-80"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>There&apos;s no data</div>
              )
            ) : (
              caregiver.map((cg, index) => (
                <div
                  key={index}
                  className="mb-5 flex w-full items-center justify-between gap-5 rounded-md border border-primary p-3"
                >
                  <div className="flex h-[100%] w-[100%] items-center gap-5 lg:mr-10 lg:gap-10">
                    <div className="min-w-[100px]">
                      <Image
                        src={
                          cg.profile_photo_url ||
                          "/images/user/Default Caregiver Photo.png"
                        }
                        height={100}
                        width={100}
                        className="h-[100px] w-[100px] rounded-full object-cover"
                        alt="CG pfp"
                      />
                    </div>
                    <div className="flex w-full items-center gap-5">
                      <div className="w-[70%]">
                        <h1 className="mb-2 font-semibold">
                          {cg.first_name + " " + cg.last_name}
                          {/* Strawberry Shortcake, A.Md.Kep. */}
                        </h1>
                        <div className="mb-2 flex gap-2">
                          <Image
                            src="/images/logo/building.svg"
                            height={20}
                            width={20}
                            alt="Building Logo"
                          />
                          <h1 className="text-sm text-dark-secondary">
                            {cg.caregiver[0].workplace}
                          </h1>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex gap-2">
                            <Image
                              src="/images/logo/briefcase.svg"
                              height={20}
                              width={20}
                              alt="Briefcase Logo"
                            />
                            <h1 className="text-sm text-dark-secondary">
                              {cg.caregiver[0].work_experiences + " years"}
                            </h1>
                          </div>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/images/logo/star.svg"
                              height={20}
                              width={20}
                              alt="Star Logo"
                            />
                            <h1 className="text-sm text-dark-secondary">
                              {cg.caregiver[0].rate?.toFixed(1) || "-"}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="h-25 w-[0.5px] bg-primary"></div>
                      <div className="flex w-[30%] justify-end">
                        <button
                          onClick={() =>
                            router.push(
                              `/patient/health-services/appointment?caregiver=${cg.user_id}`
                            )
                          }
                          className="rounded-sm bg-primary px-3 py-1 font-semibold text-white hover:bg-opacity-80"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between p-3">
            <p>
              Showing{" "}
              {filtered.length > 0
                ? (pagination.pageIndex - 1) * 5 + 1
                : caregiver.length > 0 && rating.length === 0 && location === ""
                  ? (pagination.pageIndex - 1) * 5 + 1
                  : 0}{" "}
              to{" "}
              {filtered.length > 0 || location || rating.length > 0
                ? `
  ${filtered.length > 5 ? (pagination.pageIndex - 1) * 5 + 5 : filtered.length}
of ${filtered.length} entries
  `
                : `
  ${
    caregiver.length > 5 ? (pagination.pageIndex - 1) * 5 + 5 : caregiver.length
  }
of ${caregiver.length} entries
  `}
            </p>
            <nav aria-label="Page navigation example">
              <ul className="flex h-8 items-center -space-x-px text-sm">
                <li>
                  <a
                    onClick={() => {
                      if (pagination.pageIndex - 1 > 0) {
                        setPagination({
                          ...pagination,
                          pageIndex: pagination.pageIndex - 1
                        });
                      }
                    }}
                    className={`${pagination.pageIndex === 1 && "disabled"} ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight
                     text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
                      dark:hover:bg-gray-700 dark:hover:text-white`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-2.5 w-2.5 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                  </a>
                </li>
                {pagination.pageIndex > 3 ? (
                  <>
                    {[...Array(2)].map((_, index) => (
                      <li key={index}>
                        <a
                          onClick={() => {
                            if (index + 1 < pagination.pageSize) {
                              setPagination((prev) => ({
                                ...prev,
                                pageIndex: index + 1
                              }));
                            }
                          }}
                          className={`${pagination.pageIndex === index ? "bg-kalbe-light px-3 text-white" : "bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"} flex h-8 items-center justify-center border border-gray-300`}
                        >
                          {index + 1}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        className={`disabled flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                      >
                        ...
                      </a>
                    </li>
                    <li>
                      <a
                        className={`flex h-8 items-center justify-center border border-gray-300 bg-kalbe-light px-3 leading-tight text-white hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                      >
                        {pagination.pageIndex}
                      </a>
                    </li>
                  </>
                ) : (
                  [...Array(pagination.pageIndex)].map((_, index) => (
                    <li key={index}>
                      <a
                        onClick={() => {
                          if (index + 1 < pagination.pageSize) {
                            setPagination((prev) => ({
                              ...prev,
                              pageIndex: index + 1
                            }));
                          }
                        }}
                        className={`${pagination.pageIndex === index + 1 ? "bg-kalbe-light px-3 text-white" : "bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"} flex h-8 items-center justify-center border border-gray-300`}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))
                )}
                <li>
                  <a
                    onClick={() => {
                      if (pagination.pageIndex + 1 > pagination.pageSize) {
                        return;
                      }
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: pagination.pageIndex + 1
                      }));
                    }}
                    className={`${
                      pagination.pageIndex + 1 > pagination.pageSize
                        ? "disabled"
                        : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                    }
                      flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-2.5 w-2.5 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaregiverSelection;
