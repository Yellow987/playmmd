"use client";
import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import MmdViewer from "./mmd-generator/MmdViewer";

export default function Home() {
  return (
    <>
      <MmdViewer />
    </>
  );
}
