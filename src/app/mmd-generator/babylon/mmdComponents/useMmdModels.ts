import { RootState } from "@/app/redux/store";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect, MutableRefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHARACTER_MODELS_DATA, CharacterModel } from "../../constants";
import { setMmdModels } from "@/app/redux/mmdModels";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

const useMmdModels = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntimeRef: MutableRefObject<MmdRuntime>,
): MmdModel[] => {
  const dispatch = useDispatch();
  const mmdCharacterModels: CharacterModel[] = useSelector(
    (state: RootState) => state.mmdModels.characterModels,
  );
  const [mmdRuntimeModels, setMmdRuntimeModels] = useState<MmdModel[]>([]);

  useEffect(() => {
    dispatch(setMmdModels([CharacterModel.HATSUNE_MIKU_YYB_10TH]));
  }, []);

  useEffect(() => {
    async function loadMmdModels(index: number) {
      const mmdModel = await createMmdModel(index, mmdCharacterModels[index]);
      const newMmdRuntimeModels = [...mmdRuntimeModels];
      newMmdRuntimeModels[index] = mmdModel;
      setMmdRuntimeModels(newMmdRuntimeModels);
    }

    const index = 0;
    if (!mmdCharacterModels[index]) return;
    loadMmdModels(index);
  }, [mmdCharacterModels]);

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

    const mmdModel = mmdRuntimeRef.current.createMmdModel(mmdMesh);
    return mmdModel;
  }

  return mmdRuntimeModels;
};

export default useMmdModels;
