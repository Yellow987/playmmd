"use client";
import React from "react";
import {
  Heading,
  Box,
  Flex,
  Icon,
  Link,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/menu';
import { FaUser } from "react-icons/fa"; // Example icon, replaceable with other icons
import YellowPulseText from "@/effects/text";
import { WEBSITE_NAME } from "@/config/constants";
import { useRouter } from "next/navigation"; // useRouter from Next.js
import { useAuthenticator } from "@aws-amplify/ui-react";

function Header() {
  const profileIconSrc = "";
  const router = useRouter(); // Initialize the router

  const handleLoginClick = () => {
    router.push("/login"); // Navigate to the /login page
  };

  const { authStatus, signOut, user } = useAuthenticator((context) => [context.authStatus]);
  const authenticated = authStatus === "authenticated";


  console.log("Loading header", user);

  return (
    <Box
      position="relative"
      textAlign="center"
      top={0}
      bg="white"
      zIndex={1}
      pt={0}
      pb={0}
    >
      <Flex justifyContent="center" alignItems="center">
        <Link href="/" _hover={{ textDecoration: "none" }}>
          <YellowPulseText>
            <Heading as="h1" size="lg">
              {WEBSITE_NAME}
            </Heading>
          </YellowPulseText>
        </Link>

        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            // variant={"link"}
            cursor={"pointer"}
            minW={0}
            position="absolute"
            top="50%"
            right="10px"
            transform="translateY(-50%)"
          >
            {/* {profileIconSrc ? (
              <Avatar size={"sm"} src={profileIconSrc} />
            ) : ( */}
              <Icon as={FaUser} w={6} h={6} />
            {/* )} */}
          </MenuButton>
          <MenuList>
            {!authenticated && <MenuItem onClick={handleLoginClick}>Login</MenuItem>}
            <MenuItem>Settings</MenuItem>
            {authenticated && (
              <>
                <MenuDivider />
                <MenuItem onClick={signOut}>Logout</MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}

export default Header;
