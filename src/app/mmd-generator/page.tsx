"use client";
import { useRef, useEffect, useState } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { BaseRuntime } from "./babylon/baseRuntime";
import { SceneBuilder } from "./babylon/sceneBuilder";
import { createArcCamera } from "@/app/mmd-generator/babylon/util";
import { Flex, Box, Button, useBreakpointValue } from "@chakra-ui/react";
import Presets from "./components/Presets";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";

export default function Home() {
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "row";
  const runtimeRef = useRef<BaseRuntime | null>(null);

  return (
    <>
      <Canvas runtimeRef={runtimeRef} />
      <Flex direction={flexDir}>
        <Box flex="1" p={4} maxWidth={flexDir === "row" ? "33%" : "100%"}>
          <Presets runtimeRef={runtimeRef}/>
        </Box>
        <Box flex="2" p={4} maxWidth={flexDir === "row" ? "67%" : "100%"}>
          <Controls runtimeRef={runtimeRef} />
        </Box>
      </Flex>
    </>
  );
}
