import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export type Cameras = {
  mmdCamera: MmdCamera;
  arcCamera: ArcRotateCamera;
};

const useCameras = (
  scene: Scene,
  mmdRuntime: MmdRuntime,
  canvas: HTMLCanvasElement,
): MutableRefObject<Cameras> => {
  const camerasRef = useRef<Cameras>({
    mmdCamera: createMmdCamera(scene),
    arcCamera: createArcCamera(scene, canvas),
  });
  const activeCamera = useSelector(
    (state: RootState) => state.cameras.activeCamera,
  );

  useEffect(() => {
    async function loadCameraMotion() {
      loadMmdCameraMotion();
    }

    mmdRuntime.setCamera(camerasRef.current.mmdCamera);
    loadCameraMotion();
  }, []);

  useEffect(() => {
    console.log(activeCamera);
    if (activeCamera === "mmdCamera") {
      scene.activeCamera = camerasRef.current.mmdCamera;
    } else {
      scene.activeCamera = camerasRef.current.arcCamera;
    }
  }, [activeCamera]);

  async function loadMmdCameraMotion() {
    const vmdLoader = new VmdLoader(scene);
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
      "arcRotateCamera",
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
    const mmdCamera = new MmdCamera("mmdCamera", new Vector3(0, 10, 0), scene);
    return mmdCamera;
  }

  return camerasRef;
};

export default useCameras;
