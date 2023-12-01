import { RootState } from "@/app/redux/store";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHARACTER_MODELS_DATA, CharacterModel } from "../../constants";
import { Mesh, Scene, SceneLoader } from "@babylonjs/core";
import { MmdModel } from "babylon-mmd";
import { getShadowGenerator } from "./shadowGenerator";
import { setMmdModels } from "@/app/redux/mmdModels";

const useMmdModels = (scene: Scene, mmdRuntime: MmdRuntime): MmdModel[] => {
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
    const shadowGenerator = getShadowGenerator();
    const modelData = CHARACTER_MODELS_DATA[characterModel];
    console.log("Loading model", modelData);
    const mmdMesh = await SceneLoader.ImportMeshAsync(
      "",
      modelData.folderPath,
      modelData.fileName,
      scene,
    ).then((result) => result.meshes[0] as Mesh);
    mmdMesh.receiveShadows = true;
    shadowGenerator.addShadowCaster(mmdMesh);

    const mmdModel = mmdRuntime.createMmdModel(mmdMesh);
    return mmdModel;
  }

  return mmdRuntimeModels;
};

export default useMmdModels;
