import { SceneLoader, Mesh } from "@babylonjs/core";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { CharacterModelData, ModelAniamtionPaths } from "../../constants";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { getMmdRuntime } from "./mmdRuntime";
import { getShadowGenerator } from "./shadowGenerator";
import { getScene } from "./scene";

let mmdModels: MmdModel[] = [];

export async function createAndSetMmdModel(
  index: number,
  modelData: CharacterModelData,
): Promise<MmdModel> {
  const mmdRuntime = getMmdRuntime();
  const shadowGenerator = getShadowGenerator();
  const scene = getScene();
  const mmdMesh = await SceneLoader.ImportMeshAsync(
    "",
    modelData.folderPath,
    modelData.fileName,
    scene,
  ).then((result) => result.meshes[0] as Mesh);
  mmdMesh.receiveShadows = true;
  shadowGenerator.addShadowCaster(mmdMesh);

  mmdModels[index] = mmdRuntime.createMmdModel(mmdMesh);
  return mmdModels[index];
}

export async function addMmdMotion(
  index: number,
  animationPaths: ModelAniamtionPaths,
): Promise<void> {
  const mmdModel = mmdModels[index];
  const scene = getScene();
  const orderedKeys: (keyof ModelAniamtionPaths)[] = [
    "skeletonPath",
    "facialPath",
    "lipsPath",
  ];
  const modelAnimationArray: string[] = orderedKeys
    .map((key) => animationPaths[key])
    .filter((path): path is string => path !== undefined);

  const vmdLoader = new VmdLoader(scene);
  const modelMotion = await vmdLoader.loadAsync(
    "Model_Animation",
    modelAnimationArray,
  );

  mmdModel.addAnimation(modelMotion);
  mmdModel.setAnimation("Model_Animation");
}

export function getMmdModel(index: number): MmdModel {
  const mmdModel = mmdModels[index];
  if (!mmdModel) {
    throw new Error(`MmdModel ${index} has not been created yet.`);
  }
  return mmdModel;
}
