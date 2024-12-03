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
import "babylon-mmd/esm/Loader/pmxLoader";
// if you want to use .pmd file, uncomment following line.
import "babylon-mmd/esm/Loader/pmdLoader";
// for play `MmdAnimation` we need to import following two modules.
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";

import type { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import type { BpmxLoader } from "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
// needed according to https://noname0310.github.io/babylon-mmd/docs/deep-usage/postprocesses/
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";

import type { ISceneBuilder } from "./baseRuntime";
import {
  CHARACTER_MODELS_DATA,
  CharacterModel,
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
} from "../constants";
import { createScene } from "./mmdHooks/scene";
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
import { loadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";

export class SceneBuilder implements ISceneBuilder {
  public async build(
    _canvas: HTMLCanvasElement,
    engine: Engine,
  ): Promise<Scene> {
    SdefInjector.OverrideEngineCreateEffect(engine);

    const materialBuilder = new MmdStandardMaterialBuilder();
    materialBuilder.loadOutlineRenderingProperties = (): void => {
      /* do nothing */
    };

    const scene = await createScene(engine);

    // const mmdCamera = new MmdCamera("MmdCamera", new Vector3(0, 10, 0), scene);

    //   const mmdMesh = await loadAssetContainerAsync(
    //     // "https://amplify-d2ww8jogafwege-ma-amplifystoragebucket7f87-3kftebnyakak.s3.us-east-1.amazonaws.com/models/Akabane.bpmx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUS6VUMSFMGCRAQVC%2F20241127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241127T205647Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQCW5%2B5WRtkDdFc7n%2B34m7YWIzI4oalulFvYGi7vflMHJgIgf%2BlWHm7iqbmX7mVvA34LNxyG6y07YhMIKKGjIpgQM1oq0QMIThAAGgwzMTU1OTEyNTUxNzgiDFaCLYn14Uogju%2BL1yquAyEn7KUX40ejvp5BN6X0o%2FamuT8C8NHlYpmftO%2BlVAcYteFN8mXI2DdYUcDhCYm2%2BvLvCe7Z2dH4eRTr83kJGlsLk8T3UOT7HmDXyZOEgcxxJ%2Bwjh4UTsinKniw33DVC8TBtsKdshNvX26JOFG2SNrX09E1o2NOHIyXV2ZhhBMtCr3XoVMwHt%2FsnLsuBZDvYueB0dheFOV19NnpLNCKiYoPKIEfiQH%2FIRxO86b4fHr9eyOAcauZl8Br1x3vvoWd90lnOqqjfuXxLU7yMF8VWZUZXujeSrpcet5v1hM2FP3tbAHitIE5iOL2d6NCswF6Vvehnz8Iss7dZO84374MFr1QN%2FLeF82d3y%2BJMIC3B8EfbLZENNuzovhMQWDTN9CzCXHKd67rlQKikq2%2Fc%2BbMHQ6rnPOGxFPFhD69rFt1cvXXQQNUytDoe7Ehw%2B%2BOu5bB%2BK%2BfW5lNHsc%2BMjcQ%2FYqzG5EDk31disy%2BXus3oktW9JQJtvuwnpymHbm0as95JI3vfWqUSqC7UxoSzZ2a%2BiJ2q8%2BJwhrrfUWETuHZxYuDJlxiAUgX6QZDb3e%2FpC2xOvDswle6dugY6lAIJx%2FKj6z54oQYXVA1EgRQm8VlGFfu2qrPGFLPRHx5iQGhEDxbUZcGjoX2vZiYuYmUhO1miIZBy8BD00B7Fn%2FRbgePIiW4UeuShn6LtGpuLN8UnSlq7os66dDDjp0tpiBmz4iFk5MOhOwtq7baF%2FSU%2FHpumuxld5%2BoN1Yb%2BjTyGt2pG15pxGxkFu1XThVhyaSyFqsHt7%2FyA3TvaTnruXqmSizDLZ%2BPbRNLxkSCmkkFXrJ3xjvfXP1Nn2o69aHJh715mjvMQSK9xw1axso0cfFzBbOvff4ftjLJB30adV1d%2BK7scNPn%2B6qlFx19f3jiVAxkymPoSCRgDvLQM2fllZlRo7NRzwGWMIPauVgesPUiYIxORGn8%3D&X-Amz-Signature=1ee56f5a72d9e7f9ae0d18f6033f941183f2aad49ad39a355800fc728e1de8fe&X-Amz-SignedHeaders=host&x-id=GetObject",
    //     "Akabane.bpmx",
    //     scene,
    //     {
    //         // onProgress: (event) => engine.loadingUIText = `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`,
    //         pluginOptions: {
    //             mmdmodel: {
    //                 materialBuilder: materialBuilder,
    //                 boundingBoxMargin: 60,
    //                 loggingEnabled: true
    //             }
    //         }
    //     }
    // ).then((result) => {
    //     result.addAllToScene();
    //     return result.meshes[0] as MmdMesh;
    // });

    // const mmdCamera = createMmdCamera(scene);

    // const directionalLight = new DirectionalLight(
    //   "DirectionalLight",
    //   new Vector3(0.5, -1, 1),
    //   scene,
    // );
    // directionalLight.intensity = 0.7;
    // directionalLight.shadowMaxZ = 20;
    // directionalLight.shadowMinZ = -15;
    // const shadowGenerator = createShadowGenerator(directionalLight, null);

    // const ground = MeshBuilder.CreateGround(
    //   "ground1",
    //   { width: 60, height: 60, subdivisions: 2, updatable: false },
    //   scene,
    // );
    // ground.receiveShadows = true;
    // shadowGenerator.addShadowCaster(ground);

    // const mmdRuntime = createMmdRuntime(scene);
    // mmdRuntime.setCamera(mmdCamera);

    // bpmxLoader.boundingBoxMargin = 60;

    // const mmdModel = await createAndSetMmdModel(
    //   0,
    //   CHARACTER_MODELS_DATA[CharacterModel.HATSUNE_MIKU_YYB_10TH],
    // );

    // const vmdLoader = new VmdLoader(scene);
    // await addMmdMotion(
    //   0,
    //   ANIMATION_PRESETS_DATA[AnimationPreset.FIGHTING_MY_WAY]
    //     .modelAnimationPaths[0],
    // );

    // const cameraMotion = await vmdLoader.loadAsync(
    //   "camera_motion_1",
    //   "/mmd/Animations/FightingMyWay/Camera.vmd",
    // );

    // mmdCamera.addAnimation(cameraMotion);
    // mmdCamera.setAnimation("camera_motion_1");

    // const audioPlayer = createAudioPlayer(
    //   ANIMATION_PRESETS_DATA[AnimationPreset.FIGHTING_MY_WAY].audioPath,
    // );
    // audioPlayer.volume = 1;
    // mmdRuntime.setAudioPlayer(audioPlayer);

    //const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);
    //controller.hidePlayerControl();

    //const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);

    // createArcCamera(scene, _canvas);

    // createPostProcessor();

    // mmdRuntime.playAnimation();

    return scene;
  }
}
