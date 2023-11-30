"use client";
import { useRef, useState } from "react";
import { Flex, Box, useBreakpointValue, useBoolean } from "@chakra-ui/react";
import Presets from "./controls/Presets";
import Canvas from "./babylon/Canvas";
import Controls from "./controls/Controls";
import VideoPlayer from "./videoPlayer/VideoPlayer";

export default function Home() {
  // TODO fix ssr
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "column";
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Canvas />
      {<VideoPlayer />}
      {/* <Flex direction={flexDir}>
        <Box flex="1" p={4} maxWidth={flexDir === "row" ? "33%" : "100%"}>
          <Presets />
        </Box>
        <Box flex="2" p={4} maxWidth={flexDir === "row" ? "67%" : "100%"}>
          <Controls runtimeRef={runtimeRef} />
        </Box>
      </Flex> */}
    </>
  );
}

{
  /* <Flex direction={flexDir} mt="-60px" // moves the component up by 60px
height="100px"
bg="red.200"
position="relative"> */
}
