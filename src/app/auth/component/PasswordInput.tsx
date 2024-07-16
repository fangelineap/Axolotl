"use client";

import React, { useState } from "react";

interface PasswordInputProps {
    name: string,
    label: string,
    placeholder: string,
    required?: boolean
}

const PasswordInput = ({name, label, placeholder, required}: PasswordInputProps) => {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div className="relative mb-4.5">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
        <span className="ml-1 text-red">*</span>
      </label>
      <input
        name={name}
        type={visible ? "password" : "text"}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      />
      <button
        type="button"
        className="absolute inset-0 left-auto right-5 top-8 flex cursor-pointer items-center"
        onClick={(e) => {
          e.preventDefault();
          setVisible(!visible);
        }}
      >
        {visible ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 35 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.375 12.2917C7.825 -2.04159 27.175 -2.04159 33.625 12.2917"
              stroke="#777777"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.5 19.4585C16.7941 19.4585 16.0952 19.3195 15.4431 19.0493C14.791 18.7792 14.1984 18.3833 13.6993 17.8842C13.2002 17.3851 12.8043 16.7925 12.5341 16.1404C12.264 15.4883 12.125 14.7894 12.125 14.0835C12.125 13.3776 12.264 12.6787 12.5341 12.0266C12.8043 11.3744 13.2002 10.7819 13.6993 10.2828C14.1984 9.78368 14.791 9.38776 15.4431 9.11764C16.0952 8.84752 16.7941 8.7085 17.5 8.7085C18.9255 8.7085 20.2927 9.27479 21.3007 10.2828C22.3087 11.2908 22.875 12.658 22.875 14.0835C22.875 15.509 22.3087 16.8762 21.3007 17.8842C20.2927 18.8922 18.9255 19.4585 17.5 19.4585Z"
              stroke="#777777"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 37 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.977672 0.977457C0.750098 1.20498 0.611731 1.50661 0.587729 1.82752C0.563727 2.14842 0.655684 2.46728 0.84688 2.72612L0.977672 2.87662L8.20525 10.106C4.68272 12.5776 2.16742 16.2345 1.11921 20.4081C1.03855 20.7517 1.09635 21.1133 1.28011 21.4147C1.46388 21.7161 1.75886 21.9331 2.10129 22.0187C2.44373 22.1044 2.80612 22.0519 3.11015 21.8725C3.41418 21.6932 3.63543 21.4014 3.72609 21.0602C4.65741 17.3558 6.94678 14.1366 10.1403 12.041L13.3832 15.2839C12.0878 16.6375 11.374 18.4446 11.3946 20.318C11.4153 22.1915 12.1688 23.9823 13.4937 25.307C14.8186 26.6317 16.6096 27.3849 18.4831 27.4052C20.3566 27.4255 22.1635 26.7114 23.5168 25.4158L34.1217 36.0225C34.3615 36.2629 34.6834 36.4036 35.0227 36.4164C35.362 36.4291 35.6936 36.313 35.9507 36.0912C36.2079 35.8695 36.3715 35.5586 36.4088 35.2211C36.4461 34.8836 36.3542 34.5445 36.1517 34.272L36.0209 34.1215L25.0684 23.1672L25.0702 23.1637L22.9202 21.0172L17.7781 15.8752H17.7817L12.6217 10.7205L12.6235 10.717L10.5935 8.69237L2.87684 0.977457C2.62488 0.725817 2.28335 0.584473 1.92725 0.584473C1.57116 0.584473 1.22963 0.725817 0.977672 0.977457ZM15.2823 17.1831L21.6159 23.5184C20.7711 24.3343 19.6397 24.7858 18.4652 24.7756C17.2908 24.7654 16.1674 24.2943 15.3369 23.4639C14.5064 22.6334 14.0354 21.5099 14.0252 20.3355C14.0149 19.1611 14.4664 18.0279 15.2823 17.1831ZM18.5002 6.85412C16.7085 6.85412 14.9706 7.11929 13.324 7.61558L15.5403 9.83008C19.3737 9.07105 23.3522 9.8141 26.6531 11.9056C29.9541 13.9971 32.3252 17.2771 33.276 21.0674C33.3689 21.4059 33.5905 21.6947 33.8934 21.8719C34.1964 22.0491 34.5567 22.1008 34.8972 22.0158C35.2378 21.9309 35.5316 21.716 35.7158 21.4172C35.9 21.1185 35.96 20.7595 35.8829 20.417C34.9122 16.542 32.6743 13.1026 29.5248 10.6452C26.3753 8.18779 22.4949 6.85343 18.5002 6.85412ZM18.8495 13.1429L25.6597 19.9512C25.5716 18.1737 24.8258 16.4924 23.5672 15.2341C22.3085 13.9759 20.6271 13.2305 18.8495 13.1429Z"
              fill="#777777"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
