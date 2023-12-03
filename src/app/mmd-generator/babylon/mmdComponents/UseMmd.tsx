import { useState, useEffect, MutableRefObject } from "react";
import useMmdModels from "./useMmdModels";
import useMmdMotions from "./useMmdMotions";
import usePostProcessor from "./usePostProcessor";
import useCameras from "./useCameras";
import useLighting from "./useLighting";
import useStage from "./useStage";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { Scene } from "@babylonjs/core/scene";
import useAudioPlayer from "./useAudioPlayer";
import useMmdRuntime from "./useMmdRuntime";
import { BaseRuntime } from "../baseRuntime";

interface Props {
  sceneRef: MutableRefObject<Scene>;
  canvasRef: MutableRefObject<HTMLCanvasElement>;
}

const UseMmd = (props: Props) => {
  const { sceneRef, canvasRef } = props;
  if (!sceneRef.current || !canvasRef.current) {
    throw new Error("Scene or canvas is null");
  }
  const mmdRuntimeRef = useMmdRuntime(sceneRef);
  const camerasRef = useCameras(sceneRef, mmdRuntimeRef, canvasRef);
  useLighting(sceneRef);
  useStage(sceneRef);
  useAudioPlayer(sceneRef, mmdRuntimeRef);
  const mmdRuntimeModels = useMmdModels(sceneRef, mmdRuntimeRef);
  useMmdMotions(sceneRef, mmdRuntimeModels);
  usePostProcessor(sceneRef, camerasRef, mmdRuntimeModels);
  mmdRuntimeRef.current.playAnimation();

  return <></>;
};

export default UseMmd;
