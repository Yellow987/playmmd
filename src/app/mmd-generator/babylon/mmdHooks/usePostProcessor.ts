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
import { ActiveCamera } from "@/redux/cameras";
import { ColorCurves, SSRRenderingPipeline, TAARenderingPipeline, UniversalCamera } from "@babylonjs/core";

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
      sceneRef.current.getCameraById(ActiveCamera.MMD_CAMERA) as MmdCamera,
      sceneRef.current.getCameraById(ActiveCamera.ARC_CAMERA) as ArcRotateCamera,
      sceneRef.current.getCameraById(ActiveCamera.FREE_CAMERA) as UniversalCamera,
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
    freeCamera: UniversalCamera,
  ): DefaultRenderingPipeline {
    const postProcessor = new DefaultRenderingPipeline(
      "default",
      true,
      sceneRef.current,
      [mmdCamera, arcCamera, freeCamera],
    );
    postProcessor.samples = 4;
    postProcessor.fxaaEnabled = true;

    postProcessor.depthOfFieldEnabled = true;
    postProcessor.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;
    postProcessor.depthOfField.fStop = 0.05;
    postProcessor.depthOfField.focalLength = 20;

    // postProcessor.imageProcessingEnabled = true;
    // postProcessor.imageProcessing.toneMappingEnabled = true;
    // postProcessor.imageProcessing.toneMappingType =
    //   ImageProcessingConfiguration.TONEMAPPING_ACES;
    // postProcessor.imageProcessing.exposure = 1.2; // Brighten scene slightly.
    // postProcessor.imageProcessing.contrast = 1.3; // Enhance contrast for a punchy look.

    // const colorCurves = new ColorCurves();
    // colorCurves.globalSaturation = 100; // Increase saturation (default is 0).
    // postProcessor.imageProcessing.colorCurves = colorCurves;

    // Bloom for Highlights
    // postProcessor.bloomEnabled = true;
    // postProcessor.bloomWeight = 0.6; // Subtle bloom to mimic anime lighting.
    // postProcessor.bloomThreshold = 0.9; // Focus on bright areas only.
    // postProcessor.bloomKernel = 64; // Larger kernel for softer glow.

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

  function createSSRPostProcessor(
    mmdCamera: MmdCamera,
    arcCamera: ArcRotateCamera,
    freeCamera: UniversalCamera,
  ): SSRRenderingPipeline {
    const ssrRenderingPipeline = new SSRRenderingPipeline(
      "ssr",
      sceneRef.current,
      [mmdCamera, arcCamera, freeCamera],
      false,
    );
    ssrRenderingPipeline.step = 32;
    ssrRenderingPipeline.maxSteps = 128;
    ssrRenderingPipeline.maxDistance = 500;
    ssrRenderingPipeline.enableSmoothReflections = false;
    ssrRenderingPipeline.enableAutomaticThicknessComputation = false;
    ssrRenderingPipeline.blurDownsample = 2;
    ssrRenderingPipeline.ssrDownsample = 2;
    ssrRenderingPipeline.thickness = 0.1;
    ssrRenderingPipeline.selfCollisionNumSkip = 2;
    ssrRenderingPipeline.blurDispersionStrength = 0;
    ssrRenderingPipeline.roughnessFactor = 0.1;
    ssrRenderingPipeline.reflectivityThreshold = 0.9;
    ssrRenderingPipeline.samples = 4;

    return ssrRenderingPipeline;
  }
};

export default usePostProcessor;
