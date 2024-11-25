"use client";
import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: { value: "#FFFF00" },
        lightGreen: { value: "#c9ff94" },
        limeGreen: { value: "#d2ff4c" },
        tan: { value: "#ffe28a" },
      },
      spacing: {
        "0": { value: "0px" },
        "1": { value: "8px" },
        "2": { value: "16px" },
        "3": { value: "24px" },
        "4": { value: "32px" },
        "5": { value: "40px" },
        "6": { value: "48px" },
        "7": { value: "56px" },
        "8": { value: "64px" },
      },
      lineHeights: {
        base: { value: "0.9em" },
      },
    },
  },
});
