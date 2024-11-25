"use client";
import { useRef, useState } from "react";
import { BaseRuntime } from "./babylon/baseRuntime";
import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import Presets from "./components/Presets";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";

export default function Home() {
  // TODO fix ssr
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "column";
  const runtimeRef = useRef<BaseRuntime | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Canvas runtimeRef={runtimeRef} setIsLoaded={setIsLoaded} />
      {isLoaded && <VideoPlayer runtimeRef={runtimeRef} />}
      <Flex direction={flexDir}>
        <Box flex="1" p={4} maxWidth={flexDir === "row" ? "33%" : "100%"}>
          <Presets />
        </Box>
        <Box flex="2" p={4} maxWidth={flexDir === "row" ? "67%" : "100%"}>
          <Controls runtimeRef={runtimeRef} />
        </Box>
      </Flex>
    </>
  );
}

{
  /* <Flex direction={flexDir} mt="-60px" // moves the component up by 60px
height="100px"
bg="red.200"
position="relative"> */
}
