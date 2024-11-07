"use client";

import { createTheme, ThemeOptions } from "@mui/material/styles";

const primaryColor = {
  main: "#1CBF90"
};

const themeOptions: ThemeOptions = {
  palette: {
    primary: primaryColor
  },
  typography: {
    fontFamily: "unset"
  }
};

const theme = createTheme(themeOptions);

export default theme;
