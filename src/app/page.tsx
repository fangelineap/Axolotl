import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import GuestPage from "../components/Axolotl/Home/GuestPage";

export const metadata: Metadata = {
  title: "Axolotl - Your Caregiver",
  description: "Axolotl - Your Caregiver",
};

export default function Home() {
  return (
    <>
      <GuestPage />
    </>
  );
}
