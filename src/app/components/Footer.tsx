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
import discordIcon from "@/../public/websiteAssets/discord.svg";
import Image from "next/image";

function Footer() {
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
    <Icon
      href={DISCORD_INVITE_URL}
      icon={<Image src={discordIcon} alt="Discord" width={16} height={16} />}
      style={{ paddingTop: "1.6px" }}
    />
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
          <DiscordIcon />
          <GithubIcon />
          <YoutubeIcon />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Footer;
