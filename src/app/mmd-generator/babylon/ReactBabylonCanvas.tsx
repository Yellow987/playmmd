"use client";
import { Engine, Scene as ReactScene, SceneEventArgs } from "react-babylonjs";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MmdPhysics } from "babylon-mmd/esm/Runtime/mmdPhysics";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { useSelector } from "react-redux";
import { MmdState } from "@/app/redux/store";
import { setMmdIsLoaded } from "@/app/redux/mmd";
import MmdCanvas from "./MmdCanvas";
import { BabylonMmdRuntime } from "../mmd";
import { MutableRefObject, useEffect, useState } from "react";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import { Scene } from "@babylonjs/core/scene";
import { SdefInjector } from "babylon-mmd/esm/Loader/sdefInjector";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { PmxLoader } from "babylon-mmd/esm/Loader/pmxLoader";
import { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import { Material } from "@babylonjs/core/Materials/material";
import "babylon-mmd/esm/Loader/pmxLoader";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";

type Props = {
  babylonMmdRuntimeRef: MutableRefObject<BabylonMmdRuntime>;
};

function ReactBabylonCanvas(props: Props) {
  const babylonMmdRuntimeRef = props.babylonMmdRuntimeRef;
  const dispatch = useDispatch();
  const [sceneIsMounted, setSceneIsMounted] = useState(false);

  useEffect(() => {
    if (!sceneIsMounted) return;

    const initializeScene = async () => {
      const scene: Scene = babylonMmdRuntimeRef.current.scene;
      const canvas = babylonMmdRuntimeRef.current.canvas;
      const engine = scene.getEngine();

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

      scene.enablePhysics(
        new Vector3(0, -9.8 * 10, 0),
        new HavokPlugin(true, await HavokPhysics()),
      );
      const mmdRuntime = new MmdRuntime(new MmdPhysics(scene));
      const mmdCamera = new MmdCamera(
        "mmdCamera",
        new Vector3(0, 10, 0),
        scene,
      );
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
      const postProcessor = new DefaultRenderingPipeline(
        "default",
        true,
        scene,
        [mmdCamera, arcRotateCamera],
      );

      babylonMmdRuntimeRef.current.mmdRuntime = mmdRuntime;
      dispatch(setMmdIsLoaded(true));

      engine.runRenderLoop(() => {
        scene.render();
      });

      mmdRuntime.playAnimation();
    };

    initializeScene();
  }, [sceneIsMounted]);

  const handleOnSceneMount = (sceneEventArgs: SceneEventArgs) => {
    const { scene, canvas } = sceneEventArgs;
    babylonMmdRuntimeRef.current.scene = scene;
    babylonMmdRuntimeRef.current.canvas = canvas;
    if (!sceneIsMounted) {
      setSceneIsMounted(true);
    }
  };

  return (
    <div>
      <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
        <ReactScene onSceneMount={handleOnSceneMount}>
          <></>
        </ReactScene>
      </Engine>
    </div>
  );
}

export default ReactBabylonCanvas;
