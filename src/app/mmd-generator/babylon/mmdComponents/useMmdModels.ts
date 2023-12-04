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
  const mmdCharacterModelsRef = useRef<MmdModel[]>([]);
  const prevMmdCharacterModels = useRef<CharacterModel[]>([]);

  useEffect(() => {
    async function loadMmdModel(
      index: number,
      newCharacterModel: CharacterModel,
    ) {
      const newMmdModel = await createMmdModel(index, newCharacterModel);
      mmdCharacterModelsRef.current[index] = newMmdModel;
      dispatch(setModelsLoaded([true]));
    }

    //Swap changed models
    const length = prevMmdCharacterModels.current.length;
    for (let i = 0; i < length; i++) {
      const currentModel = prevMmdCharacterModels.current[i];
      if (currentModel !== mmdCharacterModels[i]) {
        releaseMmdModel(mmdCharacterModelsRef.current[i]);
        loadMmdModel(i, mmdCharacterModels[i]);
      }
    }

    //Load new models
    for (let i = length; i < mmdCharacterModels.length; i++) {
      loadMmdModel(i, mmdCharacterModels[i]);
    }

    //Release unneeded models
    for (let i = mmdCharacterModels.length; i < length; i++) {
      releaseMmdModel(mmdCharacterModelsRef.current[i]);
    }
    prevMmdCharacterModels.current = mmdCharacterModels;
  }, [mmdCharacterModels]);

  function releaseMmdModel(mmdModelToDestroy: MmdModel) {
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
