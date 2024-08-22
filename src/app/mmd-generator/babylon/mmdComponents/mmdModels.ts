import { SceneLoader, Mesh } from "@babylonjs/core";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { CharacterModelData, ModelAniamtionPaths } from "../../constants";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { getMmdRuntime } from "./mmdRuntime";
import { getShadowGenerator } from "./shadowGenerator";
import { getScene } from "./scene";
import { getUrl } from "aws-amplify/storage";

let mmdModels: MmdModel[] = [];

export async function createAndSetMmdModel(
  index: number,
  modelData: CharacterModelData,
): Promise<MmdModel> {
  const mmdRuntime = getMmdRuntime();
  const shadowGenerator = getShadowGenerator();
  const scene = getScene();
  const { folderPath, fileName } = extractFolderPathAndFileName(modelData.url);
  const linkToStorageFile = await getUrl({
    path: "models/Vigna.bpmx",
  });
  const mmdMesh = await SceneLoader.ImportMeshAsync(
    undefined,
    String(linkToStorageFile.url),
    "",
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

export function cleanupAllModels(): void {
  console.log(mmdModels.length);
  mmdModels.forEach((mmdModel) => {
    mmdModel.mesh.dispose();
    getMmdRuntime().destroyMmdModel(mmdModel);
    console.log("CLEANUP MODEL");
  });
  mmdModels = [];
}

function extractFolderPathAndFileName(url: string) {
  try {
    // Create a new URL object from the input string
    const parsedUrl = new URL(url);

    // Extract and clean up the pathname
    const path = parsedUrl.pathname;
    const lastSlashIndex = path.lastIndexOf("/");

    // Extract folder path and file name
    const folderPath = parsedUrl.origin + path.substring(0, lastSlashIndex + 1);
    const fileName = path.substring(lastSlashIndex + 1);

    return { folderPath, fileName };
  } catch (error) {
    // If the input string is not a valid URL
    throw new Error("Invalid URL provided.");
  }
}
