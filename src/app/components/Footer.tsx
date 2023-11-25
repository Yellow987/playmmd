"use client";
import {
  GITHUB_URL,
  WEBSITE_NAME,
  YOUTUBE_URL,
  EMAIL_ADDRESS,
} from "@/config/constants";
import { Flex, chakra, Link, Box } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { FaYoutube, FaGithub, FaEnvelope } from "react-icons/fa";

function Footer() {
  const GithubIcon = () => (
    <Link
      as={NextLink}
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      mx="2"
      color="gray.600"
      _dark={{
        color: "gray.300",
        _hover: {
          color: "gray.400",
        },
      }}
      _hover={{
        color: "gray.500",
      }}
      aria-label="Github"
    >
      <FaGithub />
    </Link>
  );

  const YoutubeIcon = () => (
    <Link
      as={NextLink}
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      mx="2"
      color="gray.600"
      _dark={{
        color: "gray.300",
        _hover: {
          color: "gray.400",
        },
      }}
      _hover={{
        color: "gray.500",
      }}
      aria-label="Youtube"
    >
      <FaYoutube />
    </Link>
  );

  const EmailIcon = () => (
    <Link
      as={NextLink}
      href={"mailto:" + EMAIL_ADDRESS}
      target="_blank"
      rel="noopener noreferrer"
      mx="2"
      color="gray.600"
      _dark={{
        color: "gray.300",
        _hover: {
          color: "gray.400",
        },
      }}
      _hover={{
        color: "gray.500",
      }}
      aria-label="Email"
    >
      <FaEnvelope />
    </Link>
  );

  return (
    <Flex
      w="full"
      bg="#edf3f8"
      _dark={{
        bg: "#3e3e3e",
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        w="full"
        as="footer"
        flexDir={{
          base: "column",
          sm: "row",
        }}
        align="center"
        justify="space-between"
        px="6"
        py="2"
        //bg="white"
        _dark={{
          bg: "gray.800",
        }}
      >
        <Box
          fontSize="xl"
          fontWeight="bold"
          color="gray.600"
          _dark={{
            color: "white",
            _hover: {
              color: "gray.300",
            },
          }}
          _hover={{
            color: "gray.700",
          }}
        >
          {WEBSITE_NAME}
        </Box>

        <chakra.p
          py={{
            base: "2",
            sm: "0",
          }}
          color="gray.800"
          _dark={{
            color: "white",
          }}
        >
          Last updated:
        </chakra.p>

        <Flex mx="-2">
          <EmailIcon />
          <GithubIcon />
          <YoutubeIcon />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Footer;
