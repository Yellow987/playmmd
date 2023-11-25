// shadowGenerator.ts
import {
  ShadowGenerator,
  DirectionalLight,
  Camera,
  SceneLoader,
  Color3,
  Engine,
  HavokPlugin,
  Mesh,
  Vector3,
  HemisphericLight,
} from "@babylonjs/core";
import { MmdPhysics } from "babylon-mmd/esm/Runtime/mmdPhysics";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { Scene } from "@babylonjs/core/scene";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import HavokPhysics from "@babylonjs/havok";
import { CharacterModelData, ModelAniamtionPaths } from "../constants";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";

let scene: Scene | null = null;
let shadowGenerator: ShadowGenerator | null = null;
let mmdRuntime: MmdRuntime | null = null;
let mmdModels: MmdModel[] = [];

export async function createScene(engine: Engine): Promise<Scene> {
  scene = new Scene(engine);
  scene.enablePhysics(
    new Vector3(0, -9.8 * 10, 0),
    new HavokPlugin(true, await HavokPhysics()),
  );

  scene.ambientColor = new Color3(1, 1, 1);

  const hemisphericLight = new HemisphericLight(
    "HemisphericLight",
    new Vector3(0, 1, 0),
    scene,
  );
  hemisphericLight.intensity = 0.3;
  hemisphericLight.specular.set(0, 0, 0);
  hemisphericLight.groundColor.set(1, 1, 1);

  return scene;
}

export function createShadowGenerator(
  directionalLight: DirectionalLight,
  camera: Camera | null,
): ShadowGenerator {
  if (!shadowGenerator) {
    shadowGenerator = new ShadowGenerator(2048, directionalLight, true, camera);
    shadowGenerator.bias = 0.01;
  }
  return shadowGenerator;
}

export function createMmdRuntime(scene: Scene): MmdRuntime {
  if (!mmdRuntime) {
    mmdRuntime = new MmdRuntime(new MmdPhysics(scene));
    mmdRuntime.register(scene);
  }
  return mmdRuntime;
}

export async function createAndSetMmdModel(
  index: number,
  modelData: CharacterModelData,
): Promise<MmdModel> {
  if (!shadowGenerator || !mmdRuntime) {
    throw new Error(
      "Need shadowGenerator, mmdRuntime, before creating MmdModel.",
    );
  }
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
  if (!scene || !mmdModel) {
    throw new Error("Need mmdModel before adding motion.");
  }
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

export function createAudioPlayer(audioPath: string): StreamAudioPlayer {
  if (!mmdRuntime) {
    throw new Error("Need mmdRuntime before adding motion.");
  }
  const audioPlayer = new StreamAudioPlayer(scene);
  audioPlayer.source = audioPath;
  return audioPlayer;
}

export function getScene(): Scene {
  if (!scene) {
    throw new Error("Scene has not been created yet. Call createScene first.");
  }
  return scene;
}

export function getShadowGenerator(): ShadowGenerator {
  if (!shadowGenerator) {
    throw new Error(
      "ShadowGenerator has not been created yet. Call createShadowGenerator first.",
    );
  }
  return shadowGenerator;
}

export function getMmdRuntime(): MmdRuntime {
  if (!mmdRuntime) {
    throw new Error(
      "MmdRuntime has not been created yet. Call createMmdRuntime first.",
    );
  }
  return mmdRuntime;
}

export function getMmdModel(index: number): MmdModel {
  const mmdModel = mmdModels[index];
  if (!mmdModel) {
    throw new Error(`MmdModel ${index} has not been created yet.`);
  }
  return mmdModel;
}
