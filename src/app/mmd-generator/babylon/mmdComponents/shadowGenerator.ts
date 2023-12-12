import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Scene } from "@babylonjs/core/scene";

export function getShadowGenerator(scene: Scene): ShadowGenerator {
  console.log(scene);
  const shadowGenerator = scene
    .getLightByName("DirectionalLight")
    ?.getShadowGenerator() as ShadowGenerator;
  if (!shadowGenerator) {
    throw new Error("ShadowGenerator not found");
  }
  return shadowGenerator;
}
