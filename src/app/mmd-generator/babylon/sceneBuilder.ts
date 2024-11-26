// for use loading screen, we need to import following module.
import "@babylonjs/core/Loading/loadingScreen";
// for cast shadow, we need to import following module.
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
// for use WebXR we need to import following two modules.
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/Node/Blocks";
// if your model has .tga texture, uncomment following line.
import "@babylonjs/core/Materials/Textures/Loaders/tgaTextureLoader";
// for load .bpmx file, we need to import following module.
import "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
// if you want to use .pmx file, uncomment following line.
// import "babylon-mmd/esm/Loader/pmxLoader";
// if you want to use .pmd file, uncomment following line.
// import "babylon-mmd/esm/Loader/pmdLoader";
// for play `MmdAnimation` we need to import following two modules.
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";

import type { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import type { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import type { BpmxLoader } from "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
// needed according to https://noname0310.github.io/babylon-mmd/docs/deep-usage/postprocesses/
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";

import type { ISceneBuilder } from "./baseRuntime";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
} from "../constants";
import { createScene } from "./mmdComponents/scene";
import { createShadowGenerator } from "./mmdComponents/shadowGenerator";
import { createMmdRuntime } from "./mmdComponents/mmdRuntime";
import { addMmdMotion, createAndSetMmdModel } from "./mmdComponents/mmdModels";
import { createAudioPlayer } from "./mmdComponents/audioPlayer";
import { createArcCamera, createMmdCamera } from "./mmdComponents/cameras";
import { createPostProcessor } from "./mmdComponents/postProcessing";
import {
  MmdCamera,
  MmdMesh,
  MmdPhysics,
  MmdPlayerControl,
  MmdRuntime,
  PmxLoader,
  SdefInjector,
  StreamAudioPlayer,
  VmdLoader,
} from "babylon-mmd";

export class SceneBuilder implements ISceneBuilder {
  public async build(
    _canvas: HTMLCanvasElement,
    engine: Engine,
  ): Promise<Scene> {
    SdefInjector.OverrideEngineCreateEffect(engine);
    // const pmxLoader = SceneLoader.GetPluginForExtension(".pmx") as PmxLoader;
    // pmxLoader.useSdef = false;
    const bpmxLoader = SceneLoader.GetPluginForExtension(".bpmx") as BpmxLoader;
    bpmxLoader.loggingEnabled = true;
    const materialBuilder =
      bpmxLoader.materialBuilder as MmdStandardMaterialBuilder;
    materialBuilder.loadOutlineRenderingProperties = () => {
      /* do nothing */
    };

    const scene = await createScene(engine);

    const mmdCamera = createMmdCamera(scene);

    const directionalLight = new DirectionalLight(
      "DirectionalLight",
      new Vector3(0.5, -1, 1),
      scene,
    );
    directionalLight.intensity = 0.7;
    directionalLight.shadowMaxZ = 20;
    directionalLight.shadowMinZ = -15;
    const shadowGenerator = createShadowGenerator(directionalLight, null);

    const ground = MeshBuilder.CreateGround(
      "ground1",
      { width: 60, height: 60, subdivisions: 2, updatable: false },
      scene,
    );
    ground.receiveShadows = true;
    shadowGenerator.addShadowCaster(ground);

    const mmdRuntime = createMmdRuntime(scene);
    mmdRuntime.setCamera(mmdCamera);

    bpmxLoader.boundingBoxMargin = 60;

    // const mmdModel = await createAndSetMmdModel(
    //   0,
    //   CHARACTER_MODELS_DATA[CharacterModel.HATSUNE_MIKU_YYB_10TH],
    // );

    const vmdLoader = new VmdLoader(scene);
    // await addMmdMotion(
    //   0,
    //   ANIMATION_PRESETS_DATA[AnimationPreset.FIGHTING_MY_WAY]
    //     .modelAnimationPaths[0],
    // );

    const cameraMotion = await vmdLoader.loadAsync(
      "camera_motion_1",
      "/mmd/Animations/FightingMyWay/Camera.vmd",
    );

    mmdCamera.addAnimation(cameraMotion);
    mmdCamera.setAnimation("camera_motion_1");

    const audioPlayer = createAudioPlayer(
      ANIMATION_PRESETS_DATA[AnimationPreset.FIGHTING_MY_WAY].audioPath,
    );
    audioPlayer.volume = 1;
    mmdRuntime.setAudioPlayer(audioPlayer);

    //const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);
    //controller.hidePlayerControl();

    //const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);

    createArcCamera(scene, _canvas);

    // createPostProcessor();

    mmdRuntime.playAnimation();

    return scene;
  }
}
