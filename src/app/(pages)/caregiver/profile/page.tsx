"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectGroupTwo from "@/components/FormElements/SelectGroup/SelectGroupTwo";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import Image from "next/image";

const CaregiverProfile = () => {
  // Dummy data for initial profile state
  const initialProfileData = {
    phoneNumber: "+62 08123456789",
    birthdate: "1990-01-01", // ISO string format for date
    address: "Jl. Lorem Ipsum, Malang City, East Java, Indonesia",
    startDay: "Monday",
    endDay: "Friday",
    startTime: "18:30",
    endTime: "21:00"
  };

  const [profileData, setProfileData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false); // State to track if the profile is in edit mode

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleDateChange = (date: Date | null) => {
    setProfileData({
      ...profileData,
      birthdate: date?.toISOString().split("T")[0] ?? ""
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Profile data submitted:", profileData);
    setIsEditing(false); // Exit edit mode after submitting
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enter edit mode when "Edit Profile" is clicked
  };

  return (
    <DefaultLayout>
      <div className="sm:p-6 md:p-2">
        <nav className="mb-2 text-sm text-gray-600">Dashboard / Profile</nav>
        <h1 className="text-3xl font-bold md:text-5xl">Your Profile</h1>

        {/* Profile Header Section */}
        <div className="mt-6 flex items-center gap-4">
          <Image
            src="/images/logo/axolotl.svg" // Replace with the actual path to the avatar image
            alt="Avatar"
            className="rounded-full"
            width="150"
            height="150"
          />
          <div>
            <h2 className="text-2xl font-bold">Barry Allen</h2>
            <p className="text-gray-500">barry.allen@axolotl.com</p>
            {!isEditing ? (
              <button
                className="mt-2 rounded-lg bg-kalbe-light px-4 py-2 font-bold text-white"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-8 md:flex-row"
        >
          {/* About You Section */}
          <div className="flex-1">
            <h2 className="mb-4 text-xl font-bold text-kalbe-light">
              About You
            </h2>
            <div className="pb-3">
              <InputGroup
                name="phoneNumber"
                label="Phone Number"
                type="text"
                placeholder="Enter your phone number"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={!isEditing} // Disable input if not editing
              />
            </div>

            <div className="pb-3">
              <DatePickerOne
                name="birthdate"
                label="Birthdate"
                value={profileData.birthdate}
                onChange={handleDateChange}
                required
                disabled={!isEditing} // Disable input if not editing
              />
            </div>

            <div className="pb-3">
              <InputGroup
                name="address"
                label="Address"
                type="text"
                placeholder="Jl. Lorem Ipsum, Malang City, East Java, Indonesia"
                value={profileData.address}
                onChange={handleInputChange}
                required
                disabled={!isEditing} // Disable input if not editing
              />
            </div>
          </div>

          {/* Vertical Separator Line */}
          <div className="hidden w-[1px] bg-primary md:block"></div>

          {/* Working Schedule Section */}
          <div className="flex-1">
            <h2 className="mb-4 text-xl font-bold text-kalbe-light">
              Working Schedule
            </h2>
            <div className="mb-3 flex flex-row gap-5">
              <div className="flex-1">
                <SelectGroupTwo
                  name="startDay"
                  label="Start Day"
                  content={[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ]}
                  value={profileData.startDay}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing} // Disable input if not editing
                />
              </div>
              <div className="flex-1">
                <SelectGroupTwo
                  name="endDay"
                  label="End Day"
                  content={[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ]}
                  value={profileData.endDay}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing} // Disable input if not editing
                />
              </div>
            </div>

            <div className="mb-3 flex flex-row gap-5">
              <div className="flex-1">
                <InputGroup
                  name="startTime"
                  label="Start Time"
                  type="time"
                  value={profileData.startTime}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing} // Disable input if not editing
                  placeholder="Start Time"
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  name="endTime"
                  label="End Time"
                  type="time"
                  value={profileData.endTime}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing} // Disable input if not editing
                  placeholder="End Time"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Submit Buttons */}
        {isEditing && (
          <div className="mt-8 flex justify-start gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false); // Cancel editing and revert changes
                setProfileData(initialProfileData); // Reset to initial data
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 font-bold text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-kalbe-light px-4 py-2 font-bold text-white"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CaregiverProfile;
