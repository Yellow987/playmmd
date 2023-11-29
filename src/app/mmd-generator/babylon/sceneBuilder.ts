// for use loading screen, we need to import following module.
import "@babylonjs/core/Loading/loadingScreen";
// for cast shadow, we need to import following module.
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
// for use WebXR we need to import following two modules.
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/Node/Blocks";
// if your model has .tga texture, uncomment following line.
// import "@babylonjs/core/Materials/Textures/Loaders/tgaTextureLoader";
// for load .bpmx file, we need to import following module.
import "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
// if you want to use .pmx file, uncomment following line.
import "babylon-mmd/esm/Loader/pmxLoader";
// if you want to use .pmd file, uncomment following line.
// import "babylon-mmd/esm/Loader/pmdLoader";
// for play `MmdAnimation` we need to import following two modules.
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";

import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Scene } from "@babylonjs/core/scene";
import HavokPhysics from "@babylonjs/havok";
import { ShadowOnlyMaterial } from "@babylonjs/materials/shadowOnly/shadowOnlyMaterial";
import type { MmdAnimation } from "babylon-mmd/esm/Loader/Animation/mmdAnimation";
import type { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import type { BpmxLoader } from "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
import { BvmdLoader } from "babylon-mmd/esm/Loader/Optimized/bvmdLoader";
import { SdefInjector } from "babylon-mmd/esm/Loader/sdefInjector";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { MmdPhysics } from "babylon-mmd/esm/Runtime/mmdPhysics";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
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
import { PmxLoader } from "babylon-mmd/esm/Loader/pmxLoader";
import {
  ImageProcessingConfiguration,
  Material,
} from "@babylonjs/core/Materials";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";
import { createScene } from "./mmdComponents/scene";
import { createShadowGenerator } from "./mmdComponents/shadowGenerator";
import { createMmdRuntime } from "./mmdComponents/mmdRuntime";
import { addMmdMotion, createAndSetMmdModel } from "./mmdComponents/mmdModels";
import { createAudioPlayer } from "./mmdComponents/audioPlayer";
import { createArcCamera, createMmdCamera } from "./mmdComponents/cameras";
import { createPostProcessor } from "./mmdComponents/postProcessing";
import { MmdPlayerControl } from "../components/MmdPlayerControls";

export class SceneBuilder implements ISceneBuilder {
  public async build(
    _canvas: HTMLCanvasElement,
    engine: Engine,
  ): Promise<Scene> {
    SdefInjector.OverrideEngineCreateEffect(engine);
    const pmxLoader = SceneLoader.GetPluginForExtension(".pmx") as PmxLoader;
    pmxLoader.useSdef = false;
    const materialBuilder =
      pmxLoader.materialBuilder as MmdStandardMaterialBuilder;
    materialBuilder.useAlphaEvaluation = false;
    const alphaBlendMaterials = [
      "face02",
      "Facial02",
      "HL",
      "Hairshadow",
      "q302",
    ];
    const alphaTestMaterials = ["q301"];
    materialBuilder.afterBuildSingleMaterial = (material): void => {
      if (
        !alphaBlendMaterials.includes(material.name) &&
        !alphaTestMaterials.includes(material.name)
      )
        return;
      material.transparencyMode = alphaBlendMaterials.includes(material.name)
        ? Material.MATERIAL_ALPHABLEND
        : Material.MATERIAL_ALPHATEST;
      material.useAlphaFromDiffuseTexture = true;
      material.diffuseTexture!.hasAlpha = true;
    };
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
    const mmdModel = await createAndSetMmdModel(
      0,
      CHARACTER_MODELS_DATA[CharacterModel.HATSUNE_MIKU_YYB_10TH],
    );

    const vmdLoader = new VmdLoader(scene);
    addMmdMotion(
      0,
      ANIMATION_PRESETS_DATA[AnimationPreset.LAST_CHRISTMAS]
        .modelAnimationPaths[0],
    );

    const cameraMotion = await vmdLoader.loadAsync(
      "camera_motion_1",
      "/mmd/cam.vmd",
    );

    mmdCamera.addAnimation(cameraMotion);
    mmdCamera.setAnimation("camera_motion_1");

    const audioPlayer = createAudioPlayer(
      ANIMATION_PRESETS_DATA[AnimationPreset.LAST_CHRISTMAS].audioPath,
    );
    audioPlayer.volume = 0.2;
    mmdRuntime.setAudioPlayer(audioPlayer);

    //const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);
    //controller.hidePlayerControl();

    const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);

    createArcCamera(scene, _canvas);

    createPostProcessor();

    return scene;
  }
}
