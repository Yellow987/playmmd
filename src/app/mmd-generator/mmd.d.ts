import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { Scene } from "@babylonjs/core";

export type BabylonMmdRuntime = {
  mmdRuntime: MmdRuntime;
  scene: Scene;
  canvas: HTMLCanvasElement | null;
};
