import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { useSelector } from "react-redux";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";

const useLighting = (sceneRef: MutableRefObject<Scene>): void => {
  const light = useRef<DirectionalLight | null>(null);

  useEffect(() => {
    if (light.current) return;
    console.log("Creating light");
    createHemisphericLight(sceneRef.current)
    light.current = createDirectionalLight(sceneRef.current);
    createShadowGenerator(light.current);
  }, []);

  function createHemisphericLight(scene: Scene): void {
    const hemisphericLight = new HemisphericLight(
      "HemisphericLight",
      new Vector3(0, 1, 0),
      scene,
    );
    hemisphericLight.intensity = 0.3;
    hemisphericLight.specular.set(0, 0, 0);
    hemisphericLight.groundColor.set(1, 1, 1);
  }

  function createDirectionalLight(scene: Scene): DirectionalLight {
    const directionalLight = new DirectionalLight(
      "DirectionalLight",
      new Vector3(1, -2, 2),
      scene,
    );
    directionalLight.intensity = 0.7;
    directionalLight.autoCalcShadowZBounds = false;
    directionalLight.autoUpdateExtends = false;
    directionalLight.shadowMaxZ = 50;
    directionalLight.shadowMinZ = -50;
    directionalLight.orthoTop = 40;
    directionalLight.orthoBottom = -20;
    directionalLight.orthoLeft = -25;
    directionalLight.orthoRight = 25;
    directionalLight.shadowOrthoScale = 0;
    return directionalLight;
  }

  function createShadowGenerator(
    directionalLight: DirectionalLight,
  ): ShadowGenerator {
    const camera = sceneRef.current.getCameraById("MmdCamera") as MmdCamera;
    const shadowGenerator = new ShadowGenerator(1024, directionalLight, true);
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.forceBackFacesOnly = false;
    shadowGenerator.bias = 0.01;
    shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
    shadowGenerator.frustumEdgeFalloff = 0.1;
    shadowGenerator.bias = 0.01;

    return shadowGenerator;
  }
};

export default useLighting;
