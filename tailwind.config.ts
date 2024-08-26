import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

// MAIN BG = white
// MAIN TEXT = dark
// SECONDARY TEXT = dark-secondary

// MAIN OUTLINE = gray
// SECONDARY OUTLINE = gray-1
// TERTIARY OUTLINE = gray-2

// SUCCESS = green
// WARNING = yellow
// ERROR = red
// AWAITING = blue

// BG SUCCESS = green-light
// BG WARNING = yellow-light
// BG ERROR = red-light
// BG AWAITING = blue-light

// KALBE DARK = kalbe-dark
// KALBE MEDIUM = kalbe-medium
// KALBE LIGHT = kalbe-light
// KALBE VERY LIGHT = kalbe-veryLight
// KALBE PRO LIGHT = kalbe-proLight
// KALBE ULTRA LIGHT = kalbe-ultraLight

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      satoshi: ["Satoshi", "sans-serif"],
    },
    screens: {
      "2xsm": "375px",
      xsm: "425px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#F8F9FA", // BG Primary
        primary: "#1CBF90", // Kalbe Primary
        stroke: "#DADADA",
        "stroke-dark": "#BABABA",
        dark: {
          DEFAULT: "#111928", // Black Primary
          secondary: "#777777", // Text Secondary
          2: "#1F2A37",
          3: "#374151",
          4: "#4B5563",
          5: "#6B7280",
          6: "#9CA3AF",
          7: "#D1D5DB",
          8: "#E5E7EB",
        },
        gray: {
          DEFAULT: "#E9ECEF", // Light White
          cancel: {
            DEFAULT: "#6C757D",
            hover: "#CED4DA"
          }, // BG Cancel
          dark: "#BABABA", // Dark Gray
          1: "#DADADA", // Light Gray
          2: "#BABABA", // Dark Gray
          3: "#E5E7EB",
          4: "#D1D5DB",
          5: "#9CA3AF",
          6: "#6B7280",
          7: "#374151",
        },
        green: {
          DEFAULT: "#1CBF90",
          dark: "#26725C",
          light: {
            DEFAULT: "#1CBF90",
            1: "#1CBF90", // Kalbe medium
            2: "#D4EDD6", // Kalbe very light
            3: "#E0F7E2", // Kalbe pro light
            4: "#F0FFF0", // Kalbe ultra light
            5: "#C2F3D6",
            6: "#DAF8E6",
            7: "#E9FBF0",
          },
        },
        red: {
          DEFAULT: "#EE4D4D", // Kalbe Danger
          dark: "#EE4D4D",
          hover: "#F7CAD0",
          light: {
            DEFAULT: "#FBE3E4", // BG Kalbe Danger
            2: "#F89090",
            3: "#FBC0C0",
            4: "#FDD8D8",
            5: "#FEEBEB",
            6: "#FEF3F3",
          },
        },
        blue: {
          DEFAULT: "#3E8DD8", // Kalbe Medicine/Awaiting
          dark: "#3E8DD8", // Kalbe Medicine/Awaiting
          light: {
            DEFAULT: "#D8E8F7", // BG Kalbe Medicine/Awaiting
            2: "#8099EC",
            3: "#ADBCF2",
            4: "#C3CEF6",
            5: "#E1E8FF",
          },
        },
        orange: {
          light: {
            DEFAULT: "#F59460",
          },
        },
        yellow: {
          DEFAULT: "#F09D30", // Kalbe Warning
          hover: "#FFE97F",
          dark: {
            DEFAULT: "#F09D30", // Kalbe Warning
            2: "#D97706",
          },
          light: {
            DEFAULT: "#FFF6E1", // BG Kalbe Warning
            4: "#FFFBEB",
          },
        },
        kalbe: {
          dark: {
            DEFAULT: "#26725C",
          },
          medium: {
            DEFAULT: "#2B9879",
          },
          light: {
            DEFAULT: "#1CBF90",
          },
          veryLight: {
            DEFAULT: "#D4EDD6",
          },
          proLight: {
            DEFAULT: "#E0F7E2",
          },
          ultraLight: {
            DEFAULT: "#F0FFF0",
          },
        },
      },
      fontSize: {
        "heading-1": ["60px", "72px"],
        "heading-2": ["48px", "58px"],
        "heading-3": ["40px", "48px"],
        "heading-4": ["35px", "45px"],
        "heading-5": ["28px", "40px"],
        "heading-6": ["24px", "30px"],
        "body-2xlg": ["22px", "28px"],
        "body-sm": ["14px", "22px"],
        "body-xs": ["12px", "20px"],
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        10.5: "2.625rem",
        11: "2.75rem",
        11.5: "2.875rem",
        12.5: "3.125rem",
        13: "3.25rem",
        13.5: "3.375rem",
        14: "3.5rem",
        14.5: "3.625rem",
        15: "3.75rem",
        15.5: "3.875rem",
        16: "4rem",
        16.5: "4.125rem",
        17: "4.25rem",
        17.5: "4.375rem",
        18: "4.5rem",
        18.5: "4.625rem",
        19: "4.75rem",
        19.5: "4.875rem",
        21: "5.25rem",
        21.5: "5.375rem",
        22: "5.5rem",
        22.5: "5.625rem",
        24.5: "6.125rem",
        25: "6.25rem",
        25.5: "6.375rem",
        26: "6.5rem",
        27: "6.75rem",
        27.5: "6.875rem",
        28.5: "7.125rem",
        29: "7.25rem",
        29.5: "7.375rem",
        30: "7.5rem",
        31: "7.75rem",
        32.5: "8.125rem",
        33: "8.25rem",
        34: "8.5rem",
        34.5: "8.625rem",
        35: "8.75rem",
        36.5: "9.125rem",
        37.5: "9.375rem",
        39: "9.75rem",
        39.5: "9.875rem",
        40: "10rem",
        42.5: "10.625rem",
        44: "11rem",
        45: "11.25rem",
        46: "11.5rem",
        46.5: "11.625rem",
        47.5: "11.875rem",
        49: "12.25rem",
        50: "12.5rem",
        52: "13rem",
        52.5: "13.125rem",
        54: "13.5rem",
        54.5: "13.625rem",
        55: "13.75rem",
        55.5: "13.875rem",
        59: "14.75rem",
        60: "15rem",
        62.5: "15.625rem",
        65: "16.25rem",
        67: "16.75rem",
        67.5: "16.875rem",
        70: "17.5rem",
        72.5: "18.125rem",
        73: "18.25rem",
        75: "18.75rem",
        90: "22.5rem",
        94: "23.5rem",
        95: "23.75rem",
        100: "25rem",
        103: "25.75rem",
        115: "28.75rem",
        125: "31.25rem",
        132.5: "33.125rem",
        150: "37.5rem",
        171.5: "42.875rem",
        180: "45rem",
        187.5: "46.875rem",
        203: "50.75rem",
        230: "57.5rem",
        242.5: "60.625rem",
      },
      maxWidth: {
        2.5: "0.625rem",
        3: "0.75rem",
        4: "1rem",
        7: "1.75rem",
        9: "2.25rem",
        10: "2.5rem",
        10.5: "2.625rem",
        11: "2.75rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        16: "4rem",
        22.5: "5.625rem",
        25: "6.25rem",
        30: "7.5rem",
        34: "8.5rem",
        35: "8.75rem",
        40: "10rem",
        42.5: "10.625rem",
        44: "11rem",
        45: "11.25rem",
        46.5: "11.625rem",
        60: "15rem",
        70: "17.5rem",
        90: "22.5rem",
        94: "23.5rem",
        100: "25rem",
        103: "25.75rem",
        125: "31.25rem",
        132.5: "33.125rem",
        142.5: "35.625rem",
        150: "37.5rem",
        180: "45rem",
        203: "50.75rem",
        230: "57.5rem",
        242.5: "60.625rem",
        270: "67.5rem",
        280: "70rem",
        292.5: "73.125rem",
      },
      maxHeight: {
        35: "8.75rem",
        70: "17.5rem",
        90: "22.5rem",
        550: "34.375rem",
        300: "18.75rem",
      },
      minWidth: {
        22.5: "5.625rem",
        42.5: "10.625rem",
        47.5: "11.875rem",
        75: "18.75rem",
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        9: "9",
        1: "1",
      },
      opacity: {
        65: ".65",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "21/9": "21 / 9",
      },
      backgroundImage: {
        video: "url('../images/video/video.png')",
      },
      content: {
        "icon-copy": 'url("../images/icon/icon-copy-alt.svg")',
      },
      transitionProperty: {
        width: "width",
        stroke: "stroke",
        "transform-opacity": "transform, opacity",
      },
      borderWidth: {
        6: "6px",
        10: "10px",
        12: "12px",
      },
      boxShadow: {
        default: "0px 4px 7px 0px rgba(0, 0, 0, 0.14)",
        error: "0px 12px 34px 0px rgba(13, 10, 44, 0.05)",
        card: "0px 1px 2px 0px rgba(0, 0, 0, 0.12)",
        "card-2": "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
        "card-3": "0px 2px 3px 0px rgba(183, 183, 183, 0.50)",
        "card-4": "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        "card-5": "0px 1px 3px 0px rgba(0, 0, 0, 0.13)",
        "card-6": "0px 3px 8px 0px rgba(0, 0, 0, 0.08)",
        "card-7": "0px 0.5px 3px 0px rgba(0, 0, 0, 0.18)",
        "card-8": "0px 1px 2px 0px rgba(0, 0, 0, 0.10)",
        "card-9": "0px 1px 3px 0px rgba(0, 0, 0, 0.08)",
        "card-10": "0px 2px 3px 0px rgba(0, 0, 0, 0.10)",
        switcher:
          "0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 2px #FFFFFF, inset 0px -1px 1px rgba(0, 0, 0, 0.1)",
        "switch-1": "0px 0px 4px 0px rgba(0, 0, 0, 0.10)",
        "switch-2": "0px 0px 5px 0px rgba(0, 0, 0, 0.15)",
        datepicker: "-5px 0 0 #1f2a37, 5px 0 0 #1f2a37",
        1: "0px 1px 2px 0px rgba(84, 87, 118, 0.12)",
        2: "0px 2px 3px 0px rgba(84, 87, 118, 0.15)",
        3: "0px 8px 8.466px 0px rgba(113, 116, 152, 0.05), 0px 8px 16.224px 0px rgba(113, 116, 152, 0.07), 0px 18px 31px 0px rgba(113, 116, 152, 0.10)",
        4: "0px 13px 40px 0px rgba(13, 10, 44, 0.22), 0px -8px 18px 0px rgba(13, 10, 44, 0.04)",
        5: "0px 10px 30px 0px rgba(85, 106, 235, 0.12), 0px 4px 10px 0px rgba(85, 106, 235, 0.04), 0px -18px 38px 0px rgba(85, 106, 235, 0.04)",
        6: "0px 12px 34px 0px rgba(13, 10, 44, 0.08), 0px 34px 26px 0px rgba(13, 10, 44, 0.05)",
        7: "0px 18px 25px 0px rgba(113, 116, 152, 0.05)",
      },
      dropShadow: {
        card: "0px 8px 13px rgba(0, 0, 0, 0.07)",
        1: "0px 1px 0px #E2E8F0",
        2: "0px 1px 4px rgba(0, 0, 0, 0.12)",
        3: "0px 0px 4px rgba(0, 0, 0, 0.15)",
        4: "0px 0px 2px rgba(0, 0, 0, 0.2)",
        5: "0px 1px 5px rgba(0, 0, 0, 0.2)",
      },
      keyframes: {
        linspin: {
          "100%": { transform: "rotate(360deg)" },
        },
        easespin: {
          "12.5%": { transform: "rotate(135deg)" },
          "25%": { transform: "rotate(270deg)" },
          "37.5%": { transform: "rotate(405deg)" },
          "50%": { transform: "rotate(540deg)" },
          "62.5%": { transform: "rotate(675deg)" },
          "75%": { transform: "rotate(810deg)" },
          "87.5%": { transform: "rotate(945deg)" },
          "100%": { transform: "rotate(1080deg)" },
        },
        "left-spin": {
          "0%": { transform: "rotate(130deg)" },
          "50%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(130deg)" },
        },
        "right-spin": {
          "0%": { transform: "rotate(-130deg)" },
          "50%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(-130deg)" },
        },
        rotating: {
          "0%, 100%": { transform: "rotate(360deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        topbottom: {
          "0%, 100%": { transform: "translate3d(0, -100%, 0)" },
          "50%": { transform: "translate3d(0, 0, 0)" },
        },
        bottomtop: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -100%, 0)" },
        },
        line: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(100%)" },
        },
        "line-revert": {
          "0%, 100%": { transform: "translateY(100%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        linspin: "linspin 1568.2353ms linear infinite",
        easespin: "easespin 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "left-spin":
          "left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "right-spin":
          "right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "ping-once": "ping 5s cubic-bezier(0, 0, 0.2, 1)",
        rotating: "rotating 30s linear infinite",
        topbottom: "topbottom 60s infinite alternate linear",
        bottomtop: "bottomtop 60s infinite alternate linear",
        "spin-1.5": "spin 1.5s linear infinite",
        "spin-2": "spin 2s linear infinite",
        "spin-3": "spin 3s linear infinite",
        line1: "line 10s infinite linear",
        line2: "line-revert 8s infinite linear",
        line3: "line 7s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
