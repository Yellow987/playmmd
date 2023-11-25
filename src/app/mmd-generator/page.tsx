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
  // Use useRef to keep a reference to the canvas element
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "row";
  const runtimeRef = useRef<BaseRuntime | null>(null);
  const [doSomething, setDoSomething] = useState(false);

  useEffect(() => {
    if (runtimeRef.current && doSomething) {
      const scene = runtimeRef.current._scene;
      const arcRotateCamera = createArcCamera(
        scene,
        runtimeRef.current._canvas
      );
      scene.activeCamera = arcRotateCamera;
    }
  }, [doSomething]);

  return (
    <>
      <Canvas runtimeRef={runtimeRef} />
      <Button onClick={() => setDoSomething(!doSomething)}>
        Do something {doSomething ? "true" : "false"}
      </Button>
      <Flex direction={flexDir}>
        <Box flex="1" p={4} maxWidth={flexDir === "row" ? "33%" : "100%"}>
          <Presets />
        </Box>
        <Box flex="2" p={4} maxWidth={flexDir === "row" ? "67%" : "100%"}>
          <Controls />
        </Box>
      </Flex>
    </>
  );
}
