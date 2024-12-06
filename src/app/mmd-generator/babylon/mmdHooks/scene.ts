import HavokPhysics from "@babylonjs/havok";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MmdAmmoJSPlugin } from "babylon-mmd/esm/Runtime/Physics/mmdAmmoJSPlugin";
import ammo from "ammo.js";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

let scene: Scene | null = null;

export async function createScene(engine: Engine): Promise<Scene> {
  scene = new Scene(engine);
  scene.enablePhysics(
    new Vector3(0, -20, 0),
    new HavokPlugin(true, await HavokPhysics()),
  );

  // scene.enablePhysics(
  //   new Vector3(0, -9.8 * 10, 0),
  //   new MmdAmmoJSPlugin(true, await ammo()),
  // );

  scene.ambientColor = new Color3(1, 1, 1);

  console.log("Scene created");
  return scene;
}

export function getScene(): Scene {
  if (!scene) {
    throw new Error("Scene has not been created yet. Call createScene first.");
  }
  return scene;
}

export function cleanupScene(): void {
  console.log("CLEANUP SCENE");
  if (scene) {
    scene.dispose();
    scene = null;
    console.log("CLEANUP SCENE DONE");
  }
}
