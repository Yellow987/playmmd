"use client";
import { MutableRefObject, useRef, useState } from "react";
import { BaseRuntime } from "./babylon/baseRuntime";
import { Flex, Box, useBreakpointValue, useBoolean } from "@chakra-ui/react";
import Presets from "./components/Presets";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import UseMmd from "./babylon/mmdHooks/UseMmd";
import { Scene } from "@babylonjs/core/scene";
import VideoPlayerControls from "./components/VideoPlayer/VideoPlayerControls";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";

export type localAssets = {
  modelFile: File;
  referenceFiles: File[];
};

export type MmdViewerMode = "viewer" | "editor" | "builder";

interface MmdViewerProps {
  mode?: MmdViewerMode;
}

export default function Home({ mode = "editor" }: MmdViewerProps) {
  // TODO fix ssr
  const flexDir: "column" | "row" =
    useBreakpointValue({ base: "column", md: "row" }) || "column";
  const runtimeRef = useRef<BaseRuntime | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const localFilesRef = useRef<localAssets[]>([]);
  const mmdCharacterModelsRef = useRef<MmdModel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Canvas
        canvasRef={canvasRef}
        sceneRef={sceneRef}
        runtimeRef={runtimeRef}
        setIsLoaded={setIsLoaded}
      />
      {isLoaded && (
        <>
          <UseMmd
            sceneRef={sceneRef as MutableRefObject<Scene>}
            canvasRef={canvasRef as MutableRefObject<HTMLCanvasElement>}
            runtimeRef={runtimeRef}
            localFilesRef={localFilesRef}
            mmdCharacterModelsRef={mmdCharacterModelsRef}
            mode={mode}
          />
          <VideoPlayerControls />
        </>
      )}
      <Flex direction={flexDir}>
        <Box flex="1" p={4} maxWidth={flexDir === "row" ? "33%" : "100%"}>
          <Presets localFilesRef={localFilesRef} sceneRef={sceneRef} />
        </Box>
        <Box flex="2" p={4} maxWidth={flexDir === "row" ? "67%" : "100%"}>
          <Controls />
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
