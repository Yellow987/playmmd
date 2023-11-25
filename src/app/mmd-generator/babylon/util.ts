import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";

export function createArcCamera(
  scene: Scene,
  _canvas: HTMLCanvasElement
): ArcRotateCamera {
  const arcRotateCamera = new ArcRotateCamera(
    "arcRotateCamera",
    0,
    0,
    45,
    new Vector3(0, 10, 0),
    scene
  );
  arcRotateCamera.maxZ = 5000;
  arcRotateCamera.setPosition(new Vector3(0, 10, -45));
  arcRotateCamera.attachControl(_canvas, false);
  arcRotateCamera.inertia = 0.8;
  arcRotateCamera.speed = 10;
  return arcRotateCamera;
}
