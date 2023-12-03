"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { BaseRuntime } from "./babylon/baseRuntime";
import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import Presets from "./components/Presets";
import Canvas from "./babylon/Canvas";
import Controls from "./components/Controls";
import VideoPlayerControls from "./components/VideoPlayer/VideoPlayerControls";
import { Scene } from "@babylonjs/core/scene";
import UseMmd from "./babylon/mmdComponents/UseMmd";

export default function Home() {
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "column";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Canvas
        canvasRef={canvasRef}
        sceneRef={sceneRef}
        setIsLoaded={setIsLoaded}
      />
      {isLoaded && (
        <UseMmd
          sceneRef={sceneRef as MutableRefObject<Scene>}
          canvasRef={canvasRef as MutableRefObject<HTMLCanvasElement>}
        />
      )}
      <VideoPlayerControls />
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
