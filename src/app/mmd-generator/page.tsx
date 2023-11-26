"use client";
import { useRef, useState } from "react";
import { BaseRuntime } from "./babylon/baseRuntime";
import { Flex, Box, useBreakpointValue, useBoolean } from "@chakra-ui/react";
import Presets from "./components/Presets";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import VideoPlayer from "./components/VideoPlayer";
import VideoPlayer2 from "./components/VideoPlayer2";

export default function Home() {
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "column";
  const runtimeRef = useRef<BaseRuntime | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Canvas runtimeRef={runtimeRef} setIsLoaded={setIsLoaded} />
      {isLoaded && <VideoPlayer2 />}
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
