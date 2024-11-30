"use client";

import { USER } from "@/types/AxolotlMainType";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { globalFormatPrice } from "../../utils/Formatters/GlobalFormatters";

interface PatientHomeProps {
  currentUser: USER;
}

const PatientHome = ({ currentUser }: PatientHomeProps) => {
  const user_full_name = currentUser?.first_name + " " + currentUser?.last_name;
  const [greeting, setGreeting] = useState("Good Day");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const services = [
    {
      title: "Neonatal Care",
      image: "/images/healthservices/neonatal-care.svg",
      features: [
        "Specialized Newborn Care",
        "Providing round-the-clock monitoring, feeding assistance, and specialized care for premature or ill newborns.",
        "Developmental Support",
        "Offering early intervention therapies and developmental activities to promote healthy growth."
      ],
      price: "500.000"
    },
    {
      title: "Elderly Care",
      image: "/images/healthservices/elderly-care.svg",
      features: [
        "Personalized Assistance",
        "Providing support with daily living activities such as bathing, dressing, medication management, and meal preparation.",
        "Mobility Assistance",
        "Helping with safe transfers, ambulation, and exercises to maintain strength and mobility."
      ],
      price: "500.000"
    },
    {
      title: "After Care",
      image: "/images/healthservices/after-care.svg",
      features: [
        "Wound treatment",
        "Providing specialized care for wound cleaning, dressing changes, and monitoring for proper healing.",
        "Someone who has comorbidities",
        "Offering personalized assistance and support for managing multiple health conditions, ensuring optimal wound healing and overall well-being."
      ],
      price: "500.000"
    },
    {
      title: "Booster",
      image: "/images/healthservices/booster.svg",
      features: [
        "Immune Booster",
        "Providing support with daily living activities such as bathing, dressing, medication management, and meal preparation.",
        "Vitamin Booster",
        "Helping with safe transfers, ambulation, and exercises to maintain strength and mobility."
      ],
      price: "500.000"
    }
  ];

  const banners = [
    "/images/carousel/carousel-01.jpg",
    "/images/carousel/carousel-02.jpg",
    "/images/carousel/carousel-03.jpg"
  ];

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const CustomLeftArrow: React.FC<{
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }> = ({ onClick }) => (
    <button
      className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-800 bg-opacity-50 text-white"
      onClick={onClick}
    >
      <FaArrowLeft />
    </button>
  );

  const CustomRightArrow: React.FC<{
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }> = ({ onClick }) => (
    <button
      className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-800 bg-opacity-50 text-white"
      onClick={onClick}
    >
      <FaArrowRight />
    </button>
  );

  return (
    <div className="container mx-auto p-4 text-black">
      <div className="text-left">
        <h1 className="text-4xl">
          {greeting}, <span className="font-bold">{user_full_name}</span>{" "}
        </h1>
        <p className="mt-2">How can we help you today?</p>
      </div>

      <div className="relative my-4">
        <Carousel
          responsive={responsive}
          autoPlay={true}
          autoPlaySpeed={3000}
          infinite={true}
          showDots={true}
          customLeftArrow={<CustomLeftArrow onClick={undefined} />}
          customRightArrow={<CustomRightArrow onClick={undefined} />}
        >
          {banners.map((banner, index) => (
            <div key={index}>
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full rounded-md"
                width={1200}
                height={400}
              />
            </div>
          ))}
        </Carousel>
      </div>

      <h2 className="mb-4 text-xl font-semibold">Pick Your Health Services</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {services.map((service, index) => (
          <div key={index} className="rounded-md border">
            <Image
              src={service.image}
              alt={service.title}
              className="mb-4 w-full rounded-t-md"
              width={400}
              height={250}
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{service.title}</h3>
              {service.features.map((feature, i) => (
                <ul
                  className="ml-4 mt-2 list-outside list-disc text-sm text-black"
                  key={i}
                >
                  <li className="mt-1">{feature}</li>
                </ul>
              ))}
            </div>
            <hr className="my-1" />
            <div className="p-4 text-center">
              <p>
                Starts from
                <div className="font-bold text-black">
                  {globalFormatPrice(Number(service.price))}
                </div>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHome;
