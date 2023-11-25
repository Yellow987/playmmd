"use client";
import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

export default function Home() {
  return (
    <>
      <Link href={"/mmd-generator"}>
        <Button>MMD generator</Button>
      </Link>
    </>
  );
}
