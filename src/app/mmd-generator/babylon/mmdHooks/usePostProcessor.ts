import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef } from "react";
import { Cameras } from "./useCameras";
import { useSelector } from "react-redux";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { RootState } from "@/redux/store";

const usePostProcessor = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntimeModels: MutableRefObject<MmdModel[]>,
): void => {
  const isDepthOfFieldEnabled = useSelector(
    (state: RootState) => state.controls.isDepthOfFieldEnabled,
  );
  const mmdModelsLoaded = useSelector(
    (state: RootState) => state.mmdModels.modelsLoaded,
  );

  const postProcessorRef = useRef<DefaultRenderingPipeline | null>(null);

  useEffect(() => {
    if (postProcessorRef.current || !mmdModelsLoaded[0]) return;
    console.log(mmdModelsLoaded)
    console.log(mmdRuntimeModels.current)
    console.log("Creating post processor");
    postProcessorRef.current = createPostProcessor(
      sceneRef.current.getCameraById("MmdCamera") as MmdCamera,
      sceneRef.current.getCameraById("ArcCamera") as ArcRotateCamera,
    );
    postProcessorRef.current.depthOfFieldEnabled = isDepthOfFieldEnabled;
    console.log("Post processor created");

    return () => {
      if (!postProcessorRef.current) return;
      console.log("Disposing post processor");
      postProcessorRef.current.dispose();
      postProcessorRef.current = null;
    };
  }, [mmdModelsLoaded]);

  useEffect(() => {
    if (!postProcessorRef.current) return;
    postProcessorRef.current.depthOfFieldEnabled = isDepthOfFieldEnabled;
  }, [isDepthOfFieldEnabled]);

  function createPostProcessor(
    mmdCamera: MmdCamera,
    arcCamera: ArcRotateCamera,
  ): DefaultRenderingPipeline {
    const postProcessor = new DefaultRenderingPipeline(
      "default",
      true,
      sceneRef.current,
      [mmdCamera, arcCamera],
    );
    postProcessor.samples = 4;
    // postProcessor.bloomEnabled = true;
    // postProcessor.chromaticAberrationEnabled = true;
    // postProcessor.chromaticAberration.aberrationAmount = 1;
    postProcessor.depthOfFieldEnabled = true;
    postProcessor.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;
    // postProcessor.fxaaEnabled = true;
    // postProcessor.imageProcessingEnabled = true;
    // postProcessor.imageProcessing.toneMappingEnabled = true;
    // postProcessor.imageProcessing.toneMappingType =
    //   ImageProcessingConfiguration.TONEMAPPING_ACES;
    // postProcessor.imageProcessing.vignetteWeight = 0.5;
    // postProcessor.imageProcessing.vignetteStretch = 0.5;
    // postProcessor.imageProcessing.vignetteColor = new Color4(0, 0, 0, 0);
    // postProcessor.imageProcessing.vignetteEnabled = true;

    postProcessor.depthOfField.fStop = 0.05;
    postProcessor.depthOfField.focalLength = 20;

    for (const depthRenderer of Object.values(sceneRef.current._depthRenderer)) {
      depthRenderer.forceDepthWriteTransparentMeshes = true;
    }

    const modelskeleton = mmdRuntimeModels.current[0].mesh.metadata.skeleton;
    const headBone = modelskeleton!.bones.find((bone) => bone.name === "頭");

    const rotationMatrix = new Matrix();
    const cameraNormal = new Vector3();
    const cameraEyePosition = new Vector3();
    const headRelativePosition = new Vector3();

    sceneRef.current.onBeforeRenderObservable.add(() => {
      const cameraRotation = mmdCamera.rotation;
      Matrix.RotationYawPitchRollToRef(-cameraRotation.y, -cameraRotation.x, -cameraRotation.z, rotationMatrix);

      Vector3.TransformNormalFromFloatsToRef(0, 0, 1, rotationMatrix, cameraNormal);

      mmdCamera.position.addToRef(
          Vector3.TransformCoordinatesFromFloatsToRef(0, 0, mmdCamera.distance, rotationMatrix, cameraEyePosition),
          cameraEyePosition
      );

      headBone!.getFinalMatrix().getTranslationToRef(headRelativePosition)
          .subtractToRef(cameraEyePosition, headRelativePosition);

      postProcessor.depthOfField.focusDistance = (Vector3.Dot(headRelativePosition, cameraNormal) / Vector3.Dot(cameraNormal, cameraNormal)) * 1000;
    });
    
    return postProcessor;
  }
};

export default usePostProcessor;
