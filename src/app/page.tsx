"use client";
import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import MmdViewer from "./mmd-generator/MmdViewer";
import { FileUploader } from "@aws-amplify/ui-react-storage";

export default function Home() {
  return (
    <>
      <MmdViewer />
      <FileUploader
        path={({ identityId }) => `models/${identityId}/`}
        maxFileCount={1}
        isResumable
      />
    </>
  );
}
