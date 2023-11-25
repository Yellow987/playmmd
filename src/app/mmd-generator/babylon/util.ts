import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { getScene } from "./mmdScene";
import { BaseRuntime } from "./baseRuntime";

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
  return arcRotateCamera;
}

export const enableUserControlCamera = (
  runtimeRef: React.MutableRefObject<BaseRuntime | null>,
) => {
  const scene = getScene();
  if (runtimeRef?.current) {
    const arcRotateCamera = createArcCamera(scene, runtimeRef.current._canvas);
    scene.activeCamera = arcRotateCamera;
  }
};
