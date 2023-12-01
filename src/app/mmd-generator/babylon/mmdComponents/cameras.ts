import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { getScene } from "./scene";

type Cameras = {
  mmdCamera: MmdCamera | null;
  arcCamera: ArcRotateCamera | null;
};

let cameras: Cameras = {
  mmdCamera: null,
  arcCamera: null,
};

export function createMmdCamera(scene: Scene): MmdCamera {
  const mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 10, 0), scene);
  cameras.mmdCamera = mmdCamera;
  return mmdCamera;
}

export function createArcCamera(
  scene: Scene,
  _canvas: HTMLCanvasElement,
): ArcRotateCamera {
  const arcRotateCamera = new ArcRotateCamera(
    "arcRotateCamera",
    0,
    0,
    45,
    new Vector3(0, 10, 0),
    scene,
  );
  arcRotateCamera.maxZ = 5000;
  arcRotateCamera.setPosition(new Vector3(0, 10, -45));
  arcRotateCamera.attachControl(_canvas, false);
  arcRotateCamera.inertia = 0.8;
  arcRotateCamera.speed = 10;

  cameras.arcCamera = arcRotateCamera;
  return arcRotateCamera;
}

export function getCameras(): {
  mmdCamera: MmdCamera;
  arcCamera: ArcRotateCamera;
} {
  if (!cameras.mmdCamera || !cameras.arcCamera) {
    throw new Error("Cameras are not initialized");
  }
  return cameras as { mmdCamera: MmdCamera; arcCamera: ArcRotateCamera };
}

export const enableArcCamera = () => {
  const scene = getScene();
  const arcRotateCamera = cameras.arcCamera;
  //const postProcessor = getPostProcessor();

  //postProcessor.depthOfFieldEnabled = false;
  scene.activeCamera = arcRotateCamera;
};

export const enableMmdCamera = () => {
  const scene = getScene();
  const mmdCamera = cameras.mmdCamera;
  scene.activeCamera = mmdCamera;
};
