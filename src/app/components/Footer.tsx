"use client";
import {
  DISCORD_INVITE_URL,
  GITHUB_URL,
  WEBSITE_NAME,
  YOUTUBE_URL,
} from "@/config/constants";
import { Flex, chakra, Link, Box } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { FaYoutube, FaGithub } from "react-icons/fa";
import { createIcon } from "@chakra-ui/react";

function Footer() {
  const DiscordSVGIcon = createIcon({
    displayName: "Discord",
    viewBox: "0 0 640 640",
    d: "M524.531 69.836a1.5 1.5 0 00-.764-.7A485.065 485.065 0 00404.081 32.03a1.816 1.816 0 00-1.923.91 337.461 337.461 0 00-14.9 30.6 447.848 447.848 0 00-134.426 0 309.541 309.541 0 00-15.135-30.6 1.89 1.89 0 00-1.924-.91 483.689 483.689 0 00-119.688 37.107 1.712 1.712 0 00-.788.676C39.068 183.651 18.186 294.69 28.43 404.354a2.016 2.016 0 00.765 1.375 487.666 487.666 0 00146.825 74.189 1.9 1.9 0 002.063-.676A348.2 348.2 0 00208.12 430.4a1.86 1.86 0 00-1.019-2.588 321.173 321.173 0 01-45.868-21.853 1.885 1.885 0 01-.185-3.126 251.047 251.047 0 009.109-7.137 1.819 1.819 0 011.9-.256c96.229 43.917 200.41 43.917 295.5 0a1.812 1.812 0 011.924.233 234.533 234.533 0 009.132 7.16 1.884 1.884 0 01-.162 3.126 301.407 301.407 0 01-45.89 21.83 1.875 1.875 0 00-1 2.611 391.055 391.055 0 0030.014 48.815 1.864 1.864 0 002.063.7A486.048 486.048 0 00610.7 405.729a1.882 1.882 0 00.765-1.352c12.264-126.783-20.532-236.912-86.934-334.541zM222.491 337.58c-28.972 0-52.844-26.587-52.844-59.239s23.409-59.241 52.844-59.241c29.665 0 53.306 26.82 52.843 59.239 0 32.654-23.41 59.241-52.843 59.241zm195.38 0c-28.971 0-52.843-26.587-52.843-59.239s23.409-59.241 52.843-59.241c29.667 0 53.307 26.82 52.844 59.239 0 32.654-23.177 59.241-52.844 59.241z",
  });
  const Icon = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
    <Link
      as={NextLink}
      href={href}
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
    >
      {icon}
    </Link>
  );

  const GithubIcon = () => <Icon href={GITHUB_URL} icon={<FaGithub />} />;
  const YoutubeIcon = () => <Icon href={YOUTUBE_URL} icon={<FaYoutube />} />;
  const DiscordIcon = () => (
    <Icon href={DISCORD_INVITE_URL} icon={<DiscordSVGIcon />} />
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
        </chakra.p>

        <Flex align="center" justify="center">
          <DiscordIcon />
          <GithubIcon />
          <YoutubeIcon />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Footer;
