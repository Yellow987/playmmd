import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { useSelector } from "react-redux";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import { RootState } from "@/redux/store";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

export type Cameras = {
  mmdCamera: MmdCamera;
  arcCamera: ArcRotateCamera;
};

const useCameras = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntime: MmdRuntime,
  canvasRef: MutableRefObject<HTMLCanvasElement>,
): MutableRefObject<Cameras | null> => {
  const camerasRef = useRef<Cameras | null>(null);
  const activeCamera = useSelector(
    (state: RootState) => state.cameras.activeCamera,
  );

  useEffect(() => {
    if (camerasRef.current) return;
    const cameras = {
      mmdCamera: createMmdCamera(sceneRef.current),
      arcCamera: createArcCamera(sceneRef.current, canvasRef.current),
    };
    camerasRef.current = cameras;

    async function loadCameraMotion(cameras: Cameras) {
      loadMmdCameraMotion(cameras);
    }

    mmdRuntime.setCamera(camerasRef.current.mmdCamera);
    loadCameraMotion(camerasRef.current);
  }, []);

  useEffect(() => {
    if (!camerasRef.current) return;
    if (activeCamera === "mmdCamera") {
      sceneRef.current.activeCamera = camerasRef.current.mmdCamera;
    } else {
      sceneRef.current.activeCamera = camerasRef.current.arcCamera;
    }
  }, [activeCamera]);

  async function loadMmdCameraMotion(cameras: Cameras) {
    const vmdLoader = new VmdLoader(sceneRef.current);
    console.log("Loading camera Motion")
    const cameraMotion = await vmdLoader.loadAsync(
      "camera_motion_1",
      "/mmd/Animations/FightingMyWay/Camera.vmd",
    );
    console.log("Loaded camera Motion")
    cameras.mmdCamera.addAnimation(cameraMotion);
    cameras.mmdCamera.setAnimation("camera_motion_1");
  }

  function createArcCamera(
    scene: Scene,
    _canvas: HTMLCanvasElement,
  ): ArcRotateCamera {
    const arcRotateCamera = new ArcRotateCamera(
      "ArcCamera",
      0,
      0,
      45,
      new Vector3(0, 10, 0),
      scene,
    );
    arcRotateCamera.maxZ = 5000;
    arcRotateCamera.setPosition(new Vector3(0, 10, -45));
    arcRotateCamera.attachControl(_canvas, false);
    arcRotateCamera.inertia = 0.8;
    arcRotateCamera.speed = 10;

    return arcRotateCamera;
  }

  function createMmdCamera(scene: Scene): MmdCamera {
    const mmdCamera = new MmdCamera("MmdCamera", new Vector3(0, 10, 0), scene);
    return mmdCamera;
  }

  return camerasRef;
};

export default useCameras;