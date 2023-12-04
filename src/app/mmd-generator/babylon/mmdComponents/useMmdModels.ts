import { RootState } from "@/app/redux/store";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect, MutableRefObject, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHARACTER_MODELS_DATA, CharacterModel } from "../../constants";
import { setModels, setModelsLoaded } from "@/app/redux/mmdModels";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

const useMmdModels = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntime: MmdRuntime,
): MutableRefObject<MmdModel[]> => {
  const dispatch = useDispatch();
  const mmdCharacterModels = useSelector(
    (state: RootState) => state.mmdModels.models,
  );
  let prevCharacterModels: CharacterModel[] = [];
  const mmdCharacterModelsRef = useRef<MmdModel[]>([]);

  useEffect(() => {
    async function loadMmdModels(index: number) {
      const mmdModel = await createMmdModel(index, mmdCharacterModels[index]);
      const newMmdRuntimeModels = [...mmdCharacterModelsRef.current];
      newMmdRuntimeModels[index] = mmdModel;
      mmdCharacterModelsRef.current = newMmdRuntimeModels;
      dispatch(setModelsLoaded([true]));
    }

    const differentIndexs = getDifferentIndexes(
      mmdCharacterModels,
      prevCharacterModels,
    );
    if (differentIndexs.length === 0) return;
    prevCharacterModels = mmdCharacterModels;

    differentIndexs.forEach((index) => {
      if (mmdCharacterModelsRef.current[index]) {
        releaseMmdModel(index);
      }
      loadMmdModels(index);
    });
  }, [mmdCharacterModels]);

  function releaseMmdModel(index: number) {
    const mmdModelToDestroy = mmdCharacterModelsRef.current[index];
    mmdRuntime.destroyMmdModel(mmdModelToDestroy);
    mmdModelToDestroy.mesh.dispose();
  }

  function getDifferentIndexes(arr1: any[], arr2: any[]): number[] {
    let differentIndexs = [];
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        differentIndexs.push(i);
      }
    }
    return differentIndexs;
  }

  async function createMmdModel(
    index: number,
    characterModel: CharacterModel,
  ): Promise<MmdModel> {
    const modelData = CHARACTER_MODELS_DATA[characterModel];
    console.log("Loading model", modelData);
    const mmdMesh = await SceneLoader.ImportMeshAsync(
      "",
      modelData.folderPath,
      modelData.fileName,
      sceneRef.current,
    ).then((result) => result.meshes[0] as Mesh);
    mmdMesh.receiveShadows = true;
    const camera = sceneRef.current.getCameraById("MmdCamera") as MmdCamera;
    const shadowGenerator = sceneRef.current
      .getLightByName("DirectionalLight")
      ?.getShadowGenerator() as ShadowGenerator;
    shadowGenerator.addShadowCaster(mmdMesh);

    const mmdModel = mmdRuntime.createMmdModel(mmdMesh);
    return mmdModel;
  }

  return mmdCharacterModelsRef;
};

export default useMmdModels;
