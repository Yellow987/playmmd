import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { Scene } from "@babylonjs/core/scene";
import { MmdPhysics } from "babylon-mmd/esm/Runtime/Physics/mmdPhysics";

let mmdRuntime: MmdRuntime | null = null;

export function createMmdRuntime(scene: Scene): MmdRuntime {
  if (!mmdRuntime) {
    mmdRuntime = new MmdRuntime(scene, new MmdPhysics(scene));
    mmdRuntime.register(scene);
  }
  return mmdRuntime;
}

export function getMmdRuntime(): MmdRuntime {
  if (!mmdRuntime) {
    throw new Error(
      "MmdRuntime has not been created yet. Call createMmdRuntime first.",
    );
  }
  return mmdRuntime;
}
