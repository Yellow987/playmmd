import { Engine, HavokPlugin, Color3, HemisphericLight } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

let scene: Scene | null = null;

export async function createScene(engine: Engine): Promise<Scene> {
  scene = new Scene(engine);
  scene.enablePhysics(
    new Vector3(0, -9.8 * 10, 0),
    new HavokPlugin(true, await HavokPhysics()),
  );

  scene.ambientColor = new Color3(1, 1, 1);

  const hemisphericLight = new HemisphericLight(
    "HemisphericLight",
    new Vector3(0, 1, 0),
    scene,
  );
  hemisphericLight.intensity = 0.3;
  hemisphericLight.specular.set(0, 0, 0);
  hemisphericLight.groundColor.set(1, 1, 1);

  return scene;
}

export function getScene(): Scene {
  if (!scene) {
    throw new Error("Scene has not been created yet. Call createScene first.");
  }
  return scene;
}
