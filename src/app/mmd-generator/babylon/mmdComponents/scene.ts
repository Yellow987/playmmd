import HavokPhysics from "@babylonjs/havok";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { Color3 } from "@babylonjs/core/Maths/math.color";

let scene: Scene | null = null;

export async function createScene(engine: Engine): Promise<Scene> {
  scene = new Scene(engine);
  scene.enablePhysics(
    new Vector3(0, -9.8 * 10, 0),
    new HavokPlugin(true, await HavokPhysics()),
  );

  scene.ambientColor = new Color3(1, 1, 1);

  return scene;
}

export function getScene(): Scene {
  if (!scene) {
    throw new Error("Scene has not been created yet. Call createScene first.");
  }
  return scene;
}
