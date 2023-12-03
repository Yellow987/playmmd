import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";

export type Cameras = {
  mmdCamera: MmdCamera;
  arcCamera: ArcRotateCamera;
};

const useCameras = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntimeRef: MutableRefObject<MmdRuntime>,
  canvasRef: MutableRefObject<HTMLCanvasElement>,
): MutableRefObject<Cameras> => {
  const camerasRef = useRef<Cameras>({
    mmdCamera: createMmdCamera(sceneRef.current),
    arcCamera: createArcCamera(sceneRef.current, canvasRef.current),
  });
  const activeCamera = useSelector(
    (state: RootState) => state.cameras.activeCamera,
  );

  useEffect(() => {
    async function loadCameraMotion() {
      loadMmdCameraMotion();
    }

    mmdRuntimeRef.current.setCamera(camerasRef.current.mmdCamera);
    loadCameraMotion();
  }, []);

  useEffect(() => {
    console.log(activeCamera);
    if (activeCamera === "mmdCamera") {
      sceneRef.current.activeCamera = camerasRef.current.mmdCamera;
    } else {
      sceneRef.current.activeCamera = camerasRef.current.arcCamera;
    }
  }, [activeCamera]);

  async function loadMmdCameraMotion() {
    const vmdLoader = new VmdLoader(sceneRef.current);
    const cameraMotion = await vmdLoader.loadAsync(
      "camera_motion_1",
      "/mmd/cam.vmd",
    );
    console.log(cameraMotion);

    camerasRef.current.mmdCamera.addAnimation(cameraMotion);
    camerasRef.current.mmdCamera.setAnimation("camera_motion_1");
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
