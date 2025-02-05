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
import { UniversalCamera } from "@babylonjs/core";
import { ActiveCamera } from "@/redux/cameras";
import { downloadFromAmplifyStorageAsUrl } from "@/app/amplifyHandler/amplifyHandler";

export type Cameras = {
  mmdCamera: MmdCamera;
  arcCamera: ArcRotateCamera;
  freeCamera: UniversalCamera;
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
  const mmdCameraData = useSelector(
    (state: RootState) => state.cameras.mmdCameraData,
  );

  useEffect(() => {
    // Initializes the cameras
    if (!camerasRef.current) {
      const cameras = {
        mmdCamera: createMmdCamera(sceneRef.current),
        arcCamera: createArcCamera(sceneRef.current, canvasRef.current),
        freeCamera: createFreeCamera(sceneRef.current, canvasRef.current),
      };
      camerasRef.current = cameras;
      mmdRuntime.setCamera(camerasRef.current.mmdCamera);
    }

    async function loadCameraMotion(cameras: Cameras) {
      loadMmdCameraMotion(cameras);
    }

    loadCameraMotion(camerasRef.current);
  }, [mmdCameraData]);

  useEffect(() => {
    if (!camerasRef.current) return;
    if (activeCamera === ActiveCamera.MMD_CAMERA) {
      sceneRef.current.activeCamera = camerasRef.current.mmdCamera;
    } else if (activeCamera === ActiveCamera.ARC_CAMERA) {
      sceneRef.current.activeCamera = camerasRef.current.arcCamera;
    } else if (activeCamera === ActiveCamera.FREE_CAMERA) {
      sceneRef.current.activeCamera = camerasRef.current.freeCamera;
    }
  }, [activeCamera]);

  async function loadMmdCameraMotion(cameras: Cameras) {
    const vmdLoader = new VmdLoader(sceneRef.current);
    console.log("Loading camera Motion");

    let cameraDataPath: string = "";
    if (!mmdCameraData.isLocalMotion) {
      cameraDataPath = await downloadFromAmplifyStorageAsUrl(
        mmdCameraData.cameraPath,
      );
    } else {
      cameraDataPath = mmdCameraData.cameraPath;
    }

    const cameraMotion = await vmdLoader.loadAsync(
      "camera_motion_1",
      cameraDataPath,
    );
    console.log("Loaded camera Motion");
    cameras.mmdCamera.addAnimation(cameraMotion);
    cameras.mmdCamera.setAnimation("camera_motion_1");
  }

  function createArcCamera(
    scene: Scene,
    canvas: HTMLCanvasElement,
  ): ArcRotateCamera {
    const arcRotateCamera = new ArcRotateCamera(
      ActiveCamera.ARC_CAMERA,
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

    return arcRotateCamera;
  }

  function createFreeCamera(
    scene: Scene,
    canvas: HTMLCanvasElement,
  ): UniversalCamera {
    const freeCamera = new UniversalCamera(
      ActiveCamera.FREE_CAMERA,
      new Vector3(0, 10, 0),
      scene,
    );
    freeCamera.attachControl(canvas, true);
    return freeCamera;
  }

  function createMmdCamera(scene: Scene): MmdCamera {
    const mmdCamera = new MmdCamera(
      ActiveCamera.MMD_CAMERA,
      new Vector3(0, 10, 0),
      scene,
    );
    return mmdCamera;
  }

  return camerasRef;
};

export default useCameras;
