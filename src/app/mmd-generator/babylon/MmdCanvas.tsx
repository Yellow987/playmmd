"use client";
import { useCanvas, useScene } from "react-babylonjs";
import { initMmdRuntime, useMmdRuntime } from "./bad/mmdRuntime";
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
import { useSelector } from "react-redux";
import { MmdState } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { setMmdIsLoaded } from "@/app/redux/mmd";
import { useEffect } from "react";

function MmdCanvas() {
  const scene = useScene();
  const canvas = useCanvas();
  const mmdIsLoaded = useSelector((state: MmdState) => state.mmd.mmdIsLoaded);

  useEffect(() => {
    // const isLoaded = useSelector((state: MmdState) => state.mmd.mmdIsLoaded);
    // if (isLoaded) {
    //   return null;
    // }
    if (!scene) throw new Error("No scene");
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
    console.log(scene);

    // const dispatch = useDispatch();
    // dispatch(setMmdIsLoaded(true));
  }, []);
  return null;
}

export default MmdCanvas;
