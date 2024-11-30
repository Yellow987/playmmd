import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { appendSceneAsync, loadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import { MmdMesh } from "babylon-mmd/esm/Runtime/mmdMesh";
import { addShadowCaster } from "./useLighting";

const useStage = (sceneRef: MutableRefObject<Scene>): void => {
  useEffect(() => {
    loadStageMesh(sceneRef.current);
    // createGround(sceneRef.current);

  }, []);

  async function loadStage(scene: Scene) {
    await appendSceneAsync(
      "mmd/stage.bpmx",
      scene,
      {
        // onProgress: (event) => engine.loadingUIText = `Loading stage... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`,
        pluginOptions: {
          mmdmodel: {
            buildSkeleton: false,
            buildMorph: false,
            boundingBoxMargin: 0,
            loggingEnabled: true
          }
        }
      }
    );
  }

  async function loadStageMesh(scene: Scene) {
    const materialBuilder = new MmdStandardMaterialBuilder();
    materialBuilder.loadOutlineRenderingProperties = (): void => { /* do nothing */ };
    
    const mmdMesh = await loadAssetContainerAsync(
      "mmd/stage.bpmx",
      scene,
      {
          // onProgress: (event) => engine.loadingUIText = `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`,
          pluginOptions: {
              mmdmodel: {
                  materialBuilder: materialBuilder,
                  boundingBoxMargin: 0,
                  buildSkeleton: false,
                  buildMorph: false,
                  loggingEnabled: true
              }
          }
      }
  ).then((result) => {
      result.addAllToScene();
      return result.meshes[0] as MmdMesh;
  });
  for (const mesh of mmdMesh.metadata.meshes) {
    mesh.receiveShadows = true;
  }}

  function createGround(scene: Scene): void {
    const ground = MeshBuilder.CreateGround(
      "ground1",
      { width: 6, height: 6, subdivisions: 2, updatable: false },
      scene,
    );
    ground.receiveShadows = true;
    ground.position.y = .5;
  }
};

export default useStage;
