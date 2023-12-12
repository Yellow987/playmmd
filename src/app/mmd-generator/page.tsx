"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { BaseRuntime } from "./babylon/baseRuntime";
import { Flex, Box, useBreakpointValue, useBoolean } from "@chakra-ui/react";
import Presets from "./components/Presets";
import Canvas from "./babylon/Canvas";
import Controls from "./components/Controls";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import useMmdMotions from "./babylon/bad/useMmdMotions";
import { getMmdRuntime } from "./babylon/bad/mmdRuntime";
import { getScene, useScene } from "./babylon/bad/scene";
import ReactBabylonCanvas from "./babylon/ReactBabylonCanvas";
import { MmdRuntime } from "babylon-mmd";
import { Scene } from "@babylonjs/core/scene";
import { BabylonMmdRuntime } from "./mmd";

export default function Home() {
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "column";
  const runtimeRef = useRef<BaseRuntime | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const BabylonMmdRuntimeRef = useRef<BabylonMmdRuntime>({
    mmdRuntime: null,
    scene: null,
    canvas: null,
  });

  return (
    <>
      <ReactBabylonCanvas babylonMmdRuntimeRef={BabylonMmdRuntimeRef} />
      {isLoaded && <VideoPlayer runtimeRef={runtimeRef} />}
      <Flex direction={flexDir}>
        <Box flex="1" p={4} maxWidth={flexDir === "row" ? "33%" : "100%"}>
          <Presets babylonMmdRuntimeRef={BabylonMmdRuntimeRef} />
        </Box>
        <Box flex="2" p={4} maxWidth={flexDir === "row" ? "67%" : "100%"}>
          {/* <Controls runtimeRef={runtimeRef} /> */}
        </Box>
      </Flex>
    </>
  );
}
