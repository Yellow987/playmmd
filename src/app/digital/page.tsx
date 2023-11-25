"use client";
import Image from "next/image";
import React from "react";
import { Box, Button, Center } from "@chakra-ui/react";
import UnderConstruction from "@/components/underConstruction";
import { Link } from "@chakra-ui/next-js";

export default function Home() {
  return (
    <>
      <Box
        style={{
          width: "100%",
          height: "500px",
          minHeight: "500px",
          position: "relative",
        }}
      >
        <Image
          src="/images/YellowVRC_3.png"
          alt="My Image"
          fill
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
          quality={100}
        />
      </Box>
      <Center>
        <Link href={"/mmd-generator"}>
          <Button>MMD generator</Button>
        </Link>
      </Center>
      <UnderConstruction size={100} />
      hi
    </>
  );
}
