// for use loading screen, we need to import following module.
import "@babylonjs/core/Loading/loadingScreen";
// for cast shadow, we need to import following module.
// import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
// for use WebXR we need to import following two modules.
// import "@babylonjs/core/Helpers/sceneHelpers";
// import "@babylonjs/core/Materials/Node/Blocks";
// if your model has .tga texture, uncomment following line.
// import "@babylonjs/core/Materials/Textures/Loaders/tgaTextureLoader";
// for load .bpmx file, we need to import following module.
import "babylon-mmd/esm/Loader/Optimized/bpmxLoader";
// if you want to use .pmx file, uncomment following line.
import "babylon-mmd/esm/Loader/pmxLoader";
// if you want to use .pmd file, uncomment following line.
// import "babylon-mmd/esm/Loader/pmdLoader";
// for play `MmdAnimation` we need to import following two modules.

import type { Engine } from "@babylonjs/core/Engines/engine";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Scene } from "@babylonjs/core/scene";
import type { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import { SdefInjector } from "babylon-mmd/esm/Loader/sdefInjector";
import type { ISceneBuilder } from "./baseRuntime";
import { PmxLoader } from "babylon-mmd/esm/Loader/pmxLoader";
import { Material } from "@babylonjs/core/Materials";
import { createScene } from "./mmdComponents/scene";
import HavokPhysics from "@babylonjs/havok";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { Color3 } from "@babylonjs/core/Maths/math.color";
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

    const scene = createScene(engine);
    // const scene = new Scene(engine);
    // scene.enablePhysics(
    //   new Vector3(0, -9.8 * 10, 0),
    //   new HavokPlugin(true, await HavokPhysics()),
    // );

    // scene.ambientColor = new Color3(1, 1, 1);

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

    //const mmdRuntime = createMmdRuntime(scene);
    //mmdRuntime.setCamera(mmdCamera);
    // const mmdModel = await createAndSetMmdModel(
    //   0,
    //   CHARACTER_MODELS_DATA[CharacterModel.HATSUNE_MIKU_YYB_10TH],
    // );

    // addMmdMotion(
    //   0,
    //   ANIMATION_PRESETS_DATA[defaultAnimationPreset].modelAnimationPaths[0],
    // );
    // const mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 10, 0), scene);
    // const vmdLoader = new VmdLoader(scene);

    // const cameraMotion = await vmdLoader.loadAsync(
    //   "camera_motion_1",
    //   "/mmd/cam.vmd",
    // );

    // mmdCamera.addAnimation(cameraMotion);
    // mmdCamera.setAnimation("camera_motion_1");

    // const audioPlayer = createAudioPlayer(
    //   ANIMATION_PRESETS_DATA[AnimationPreset.LAST_CHRISTMAS].audioPath,
    // );
    // audioPlayer.volume = 1;
    //mmdRuntime.setAudioPlayer(audioPlayer);

    //const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);
    //controller.hidePlayerControl();

    //const controller = new MmdPlayerControl(scene, mmdRuntime, audioPlayer);

    //createArcCamera(scene, _canvas);

    //createPostProcessor();

    //mmdRuntime.playAnimation();

    return scene;
  }
}
