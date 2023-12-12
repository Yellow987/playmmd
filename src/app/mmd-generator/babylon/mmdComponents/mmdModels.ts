import { SceneLoader, Mesh, Scene } from "@babylonjs/core";
import { CharacterModelData, ModelAniamtionPaths } from "../../constants";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { BabylonMmdRuntime } from "../../mmd";
import { getShadowGenerator } from "./shadowGenerator";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import "babylon-mmd/esm/Loader/pmxLoader";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";

export async function createAndSetMmdModel(
  index: number,
  babylonMmdRuntime: BabylonMmdRuntime,
  modelData: CharacterModelData,
) {
  const scene: Scene = babylonMmdRuntime.scene;
  const mmdRuntime: MmdRuntime = babylonMmdRuntime.mmdRuntime;
  const mmdModels = mmdRuntime.models;
  const shadowGenerator = getShadowGenerator(scene);

  if (mmdModels[index]) {
    deleteMmdModel(index, babylonMmdRuntime);
  }

  const mmdMesh = await SceneLoader.ImportMeshAsync(
    "",
    modelData.folderPath,
    modelData.fileName,
    scene,
  ).then((result) => result.meshes[0] as Mesh);
  mmdMesh.receiveShadows = true;
  shadowGenerator.addShadowCaster(mmdMesh);

  mmdRuntime.createMmdModel(mmdMesh);
}

export function deleteMmdModel(
  index: number,
  babylonMmdRuntime: BabylonMmdRuntime,
) {
  const mmdRuntime: MmdRuntime = babylonMmdRuntime.mmdRuntime;
  const mmdModel = mmdRuntime.models[index];
  mmdRuntime.destroyMmdModel(mmdModel);
  mmdModel.mesh.dispose();
}

export async function addMmdMotion(
  index: number,
  babylonMmdRuntime: BabylonMmdRuntime,
  animationPaths: ModelAniamtionPaths,
): Promise<void> {
  const scene = babylonMmdRuntime.scene;
  const mmdRuntime: MmdRuntime = babylonMmdRuntime.mmdRuntime;
  const mmdModel = mmdRuntime.models[index];
  console.log(mmdModel);
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
  console.log(modelMotion);

  mmdModel.addAnimation(modelMotion);
  mmdModel.setAnimation("Model_Animation");
  console.log(mmdModel.currentAnimation);
}
