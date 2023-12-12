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

import type { ISceneBuilder, Mmd } from "./baseRuntime";
import {
  CHARACTER_MODELS_DATA,
  CharacterModel,
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
  defaultAnimationPreset,
} from "../constants";
import { PmxLoader } from "babylon-mmd/esm/Loader/pmxLoader";
import {
  ImageProcessingConfiguration,
  Material,
} from "@babylonjs/core/Materials";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";
import { createShadowGenerator } from "./bad/shadowGenerator";
import { addMmdMotion, createAndSetMmdModel } from "./mmdComponents/mmdModels";
import { createAudioPlayer } from "./bad/audioPlayer";
import { createArcCamera, createMmdCamera } from "./bad/cameras";
import { createPostProcessor } from "./bad/postProcessing";
import { MmdPlayerControl } from "../components/MmdPlayerControls";
import { useLights } from "./bad/lighting";

export class SceneBuilder implements ISceneBuilder {
  public async build(canvas: HTMLCanvasElement, engine: Engine): Promise<Mmd> {
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

    const scene = new Scene(engine);
    scene.enablePhysics(
      new Vector3(0, -9.8 * 10, 0),
      new HavokPlugin(true, await HavokPhysics()),
    );

    const mmdRuntime = new MmdRuntime(new MmdPhysics(scene));
    const mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 10, 0), scene);
    const directionalLight = new DirectionalLight(
      "DirectionalLight",
      new Vector3(0.5, -1, 1),
      scene,
    );
    directionalLight.intensity = 0.7;
    directionalLight.shadowMaxZ = 20;
    directionalLight.shadowMinZ = -15;
    const shadowGenerator = new ShadowGenerator(2048, directionalLight, true);
    const arcRotateCamera = new ArcRotateCamera(
      "arcRotateCamera",
      0,
      0,
      45,
      new Vector3(0, 10, 0),
      scene,
    );
    arcRotateCamera.maxZ = 5000;
    arcRotateCamera.setPosition(new Vector3(0, 10, -45));
    arcRotateCamera.attachControl(canvas, false);
    arcRotateCamera.inertia = 0.8;
    arcRotateCamera.speed = 10;

    const ground = MeshBuilder.CreateGround(
      "STAGE",
      { width: 60, height: 60, subdivisions: 2, updatable: false },
      scene,
    );
    ground.receiveShadows = true;

    const audioPlayer = new StreamAudioPlayer(scene);
    mmdRuntime.setAudioPlayer(audioPlayer);
    const postProcessor = new DefaultRenderingPipeline("default", true, scene, [
      mmdCamera,
      arcRotateCamera,
    ]);

    const mmd: Mmd = {
      scene,
      mmdRuntime,
      canvas,
      postProcessor,
      audioPlayer,
    };
    return mmd;
  }
}
