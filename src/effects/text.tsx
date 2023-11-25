import React from "react";
import { Box, useTheme  } from "@chakra-ui/react";
import { keyframes } from '@emotion/react';

type Props = {
  children: React.ReactNode;
};

const YellowPulseText = ({ children }: Props) => {
  const scroll = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

  return (
    <Box
      as="div"
      fontSize="xl"
      fontWeight="bold"
      lineHeight="shorter"
      p={5}
      backgroundImage="linear-gradient(to right, yellow, orange, black, black, orange, yellow, orange, black, black, orange, yellow)"
      backgroundSize="200% 200%"
      animation={`${scroll} 2s linear infinite`}
      bgClip='text'
    >
      {children}
    </Box>
  );
};

export default YellowPulseText;
