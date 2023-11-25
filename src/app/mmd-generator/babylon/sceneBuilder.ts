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
import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";

import type { ISceneBuilder } from "./baseRuntime";

export class SceneBuilder implements ISceneBuilder {
  public async build(
    _canvas: HTMLCanvasElement,
    engine: Engine
  ): Promise<Scene> {
    SdefInjector.OverrideEngineCreateEffect(engine);
    const scene = new Scene(engine);
    scene.enablePhysics(
      new Vector3(0, -9.8 * 10, 0),
      new HavokPlugin(true, await HavokPhysics())
    );

    scene.ambientColor = new Color3(1, 1, 1);

    const camera = new MmdCamera("mmdCamera", new Vector3(0, 10, 0), scene);

    const hemisphericLight = new HemisphericLight(
      "HemisphericLight",
      new Vector3(0, 1, 0),
      scene
    );
    hemisphericLight.intensity = 0.3;
    hemisphericLight.specular.set(0, 0, 0);
    hemisphericLight.groundColor.set(1, 1, 1);

    const directionalLight = new DirectionalLight(
      "DirectionalLight",
      new Vector3(0.5, -1, 1),
      scene
    );
    directionalLight.intensity = 0.7;
    directionalLight.shadowMaxZ = 20;
    directionalLight.shadowMinZ = -15;

    const shadowGenerator = new ShadowGenerator(
      2048,
      directionalLight,
      true,
      camera
    );
    shadowGenerator.bias = 0.01;

    const ground = MeshBuilder.CreateGround(
      "ground1",
      { width: 60, height: 60, subdivisions: 2, updatable: false },
      scene
    );
    ground.receiveShadows = true;
    shadowGenerator.addShadowCaster(ground);

    const mmdMesh = await SceneLoader.ImportMeshAsync(
      "",
      "/mmd/YYB Hatsune Miku_10th/",
      "YYB Hatsune Miku_10th_v1.02.pmx",
      scene
    ).then((result) => result.meshes[0] as Mesh);
    mmdMesh.receiveShadows = true;
    shadowGenerator.addShadowCaster(mmdMesh);

    const mmdRuntime = new MmdRuntime(new MmdPhysics(scene));
    mmdRuntime.register(scene);

    mmdRuntime.setCamera(camera);
    const mmdModel = mmdRuntime.createMmdModel(mmdMesh);

    const vmdLoader = new VmdLoader(scene);
    const modelMotion = await vmdLoader.loadAsync("model_motion_1", [
      "/mmd/paint.vmd",
    ]);

    const cameraMotion = await vmdLoader.loadAsync(
      "camera_motion_1",
      "/mmd/cam.vmd"
    );

    mmdModel.addAnimation(modelMotion);
    mmdModel.setAnimation("model_motion_1");

    camera.addAnimation(cameraMotion);
    camera.setAnimation("camera_motion_1");

    const audioPlayer = new StreamAudioPlayer(scene);
    audioPlayer.source = "/mmd/paint.wav";
    mmdRuntime.setAudioPlayer(audioPlayer);

    mmdRuntime.playAnimation();

    new MmdPlayerControl(scene, mmdRuntime, audioPlayer);

    return scene;
  }
}
