import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  Color4,
  DefaultRenderingPipeline,
  DepthOfFieldEffectBlurLevel,
  ImageProcessingConfiguration,
  Matrix,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { MmdCamera, MmdModel } from "babylon-mmd";
import { Cameras } from "./useCameras";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const usePostProcessor = (
  scene: Scene,
  camerasRef: React.MutableRefObject<Cameras>,
  mmdRuntimeModels: MmdModel[],
): void => {
  const depthOfFieldEnabled = useSelector(
    (state: RootState) => state.controls.depthOfFieldEnabled,
  );
  const postProcessorRef = useRef<DefaultRenderingPipeline | null>(null);

  useEffect(() => {
    if (!mmdRuntimeModels[0]) return;
    const mmdModel = mmdRuntimeModels[0];
    const newPostProcessor = createPostProcessor(
      mmdModel,
      camerasRef.current.mmdCamera,
      camerasRef.current.arcCamera,
    );
    postProcessorRef.current = newPostProcessor;
  }, [mmdRuntimeModels]);

  useEffect(() => {
    if (!postProcessorRef.current) return;
    postProcessorRef.current.depthOfFieldEnabled = depthOfFieldEnabled;
  }, [depthOfFieldEnabled]);

  function createPostProcessor(
    mmdModel: MmdModel,
    mmdCamera: MmdCamera,
    arcCamera: ArcRotateCamera,
  ): DefaultRenderingPipeline {
    const postProcessor = new DefaultRenderingPipeline("default", true, scene, [
      mmdCamera,
      arcCamera,
    ]);
    postProcessor.samples = 4;
    postProcessor.bloomEnabled = true;
    postProcessor.chromaticAberrationEnabled = true;
    postProcessor.chromaticAberration.aberrationAmount = 1;
    postProcessor.depthOfFieldEnabled = true;
    postProcessor.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.High;
    postProcessor.fxaaEnabled = true;
    postProcessor.imageProcessingEnabled = true;
    postProcessor.imageProcessing.toneMappingEnabled = true;
    postProcessor.imageProcessing.toneMappingType =
      ImageProcessingConfiguration.TONEMAPPING_ACES;
    postProcessor.imageProcessing.vignetteWeight = 0.5;
    postProcessor.imageProcessing.vignetteStretch = 0.5;
    postProcessor.imageProcessing.vignetteColor = new Color4(0, 0, 0, 0);
    postProcessor.imageProcessing.vignetteEnabled = true;

    postProcessor.depthOfField.fStop = 0.05;
    postProcessor.depthOfField.focalLength = 20;

    const headBone = mmdModel.skeleton!.bones.find(
      (bone) => bone.name === "頭",
    );

    const rotationMatrix = new Matrix();
    const cameraNormal = new Vector3();
    const cameraEyePosition = new Vector3();
    const headRelativePosition = new Vector3();

    scene.onBeforeRenderObservable.add(() => {
      const cameraRotation = mmdCamera.rotation;
      Matrix.RotationYawPitchRollToRef(
        -cameraRotation.y,
        -cameraRotation.x,
        -cameraRotation.z,
        rotationMatrix,
      );

      Vector3.TransformNormalFromFloatsToRef(
        0,
        0,
        1,
        rotationMatrix,
        cameraNormal,
      );

      mmdCamera.position.addToRef(
        Vector3.TransformCoordinatesFromFloatsToRef(
          0,
          0,
          mmdCamera.distance,
          rotationMatrix,
          cameraEyePosition,
        ),
        cameraEyePosition,
      );

      headBone!
        .getFinalMatrix()
        .getTranslationToRef(headRelativePosition)
        .subtractToRef(cameraEyePosition, headRelativePosition);

      if (!postProcessor) return;
      postProcessor.depthOfField.focusDistance =
        (Vector3.Dot(headRelativePosition, cameraNormal) /
          Vector3.Dot(cameraNormal, cameraNormal)) *
        1000;
    });

    return postProcessor;
  }
};

export default usePostProcessor;
