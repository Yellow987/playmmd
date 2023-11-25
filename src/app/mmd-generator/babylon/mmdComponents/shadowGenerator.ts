import { Camera, ShadowGenerator, DirectionalLight } from "@babylonjs/core";

let shadowGenerator: ShadowGenerator | null = null;

export function createShadowGenerator(
  directionalLight: DirectionalLight,
  camera: Camera | null,
): ShadowGenerator {
  if (!shadowGenerator) {
    shadowGenerator = new ShadowGenerator(2048, directionalLight, true, camera);
    shadowGenerator.bias = 0.01;
  }
  return shadowGenerator;
}

export function getShadowGenerator(): ShadowGenerator {
  if (!shadowGenerator) {
    throw new Error(
      "ShadowGenerator has not been created yet. Call createShadowGenerator first.",
    );
  }
  return shadowGenerator;
}
