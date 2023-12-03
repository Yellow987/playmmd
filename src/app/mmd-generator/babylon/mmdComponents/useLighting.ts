import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

const useLighting = (sceneRef: MutableRefObject<Scene>): void => {
  useEffect(() => {
    const light = createDirectionalLight(sceneRef.current);
    createShadowGenerator(light);
  }, []);

  function createDirectionalLight(scene: Scene): DirectionalLight {
    const directionalLight = new DirectionalLight(
      "DirectionalLight",
      new Vector3(0.5, -1, 1),
      scene,
    );
    directionalLight.intensity = 0.7;
    directionalLight.autoCalcShadowZBounds = false;
    directionalLight.autoUpdateExtends = false;
    directionalLight.shadowMaxZ = 20;
    directionalLight.shadowMinZ = -20;
    directionalLight.orthoTop = 18;
    directionalLight.orthoBottom = -3;
    directionalLight.orthoLeft = -10;
    directionalLight.orthoRight = 10;
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
