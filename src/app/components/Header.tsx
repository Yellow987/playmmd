"use client";
import React from "react";
import { Heading, Box } from "@chakra-ui/react";
import YellowPulseText from "@/effects/text";
import { WEBSITE_NAME } from "@/config/constants";
import { Link } from "@chakra-ui/next-js";

function Header() {
  return (
    <Box
      textAlign="center"
      top={0}
      bg="white"
      zIndex={1}
      pt={0}
      pb={0}
    >
      <Link href="/" _hover={{ textDecoration: "none" }}>
        <YellowPulseText>
          <Heading as="h1" size="lg">
            {WEBSITE_NAME}
          </Heading>
        </YellowPulseText>
      </Link>
    </Box>
  );
}

export default Header;
