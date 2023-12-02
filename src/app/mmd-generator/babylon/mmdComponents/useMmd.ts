import { useState, useEffect } from "react";
import useMmdModels from "./useMmdModels";
import useMmdMotions from "./useMmdMotions";
import usePostProcessor from "./usePostProcessor";
import { Scene } from "@babylonjs/core";
import { MmdRuntime } from "babylon-mmd";
import useCameras from "./useCameras";

const useMmd = (
  scene: Scene,
  mmdRuntime: MmdRuntime,
  canvas: HTMLCanvasElement,
): void => {
  const mmdRuntimeModels = useMmdModels(scene, mmdRuntime);
  useMmdMotions(scene, mmdRuntime, mmdRuntimeModels);
  const camerasRef = useCameras(scene, mmdRuntime, canvas);
  usePostProcessor(scene, camerasRef, mmdRuntimeModels);
};

export default useMmd;
