"use client";
import { MutableRefObject, useRef, useState, useEffect } from "react";
import { BaseRuntime } from "../mmd-generator/babylon/baseRuntime";
import { Box } from "@chakra-ui/react";
import Canvas from "../mmd-generator/components/Canvas";
import UseMmd from "../mmd-generator/babylon/mmdHooks/UseMmd";
import { Scene } from "@babylonjs/core/scene";
import VideoPlayerControls from "../mmd-generator/components/VideoPlayer/VideoPlayerControls";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { useDispatch } from "react-redux";
import { setModels } from "@/redux/mmdModels";
import {
  CHARACTER_MODELS_DATA,
  defaultCharacterModel,
  CharacterModelData,
} from "../mmd-generator/constants";
import { localAssets } from "../mmd-generator/MmdViewer";

export default function MmdBuilder() {
  const dispatch = useDispatch();
  const runtimeRef = useRef<BaseRuntime | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const localFilesRef = useRef<localAssets[]>([]);
  const mmdCharacterModelsRef = useRef<MmdModel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Redux state with local model on component mount
  useEffect(() => {
    // Use local model to avoid external URL issues
    const localModelData: CharacterModelData = {
      name: "Default Model",
      path: "mmd/models/model.bpmx",
      isLocalModel: true,
    };
    dispatch(setModels([localModelData]));
  }, [dispatch]);

  return (
    <Box height="100vh" width="100%" position="relative">
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
            mode="builder"
          />
          <VideoPlayerControls canvasRef={canvasRef} sceneRef={sceneRef} />
        </>
      )}
    </Box>
  );
}
