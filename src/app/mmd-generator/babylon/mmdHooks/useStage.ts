import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

const useStage = (sceneRef: MutableRefObject<Scene>): void => {
  useEffect(() => {
    createGround(sceneRef.current);
  }, []);

  function createGround(scene: Scene): void {
    const ground = MeshBuilder.CreateGround(
      "ground1",
      { width: 60, height: 60, subdivisions: 2, updatable: false },
      scene,
    );
    ground.receiveShadows = true;
    const camera = scene.getCameraById("MmdCamera") as MmdCamera;
    const shadowGenerator = scene
      .getLightByName("DirectionalLight")
      ?.getShadowGenerator() as ShadowGenerator;
    //shadowGenerator.addShadowCaster(ground);
  }
};

export default useStage;
