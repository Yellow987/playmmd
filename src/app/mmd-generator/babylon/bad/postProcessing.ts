import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { getScene } from "./scene";
import { getCameras } from "./cameras";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { getMmdModel } from "../mmdComponents/mmdModels";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";

let postProcessor: DefaultRenderingPipeline | null = null;

export function createPostProcessor(): void {
  const scene = getScene();
  const cameras = getCameras();
  const mmdModel = getMmdModel(0);

  postProcessor = new DefaultRenderingPipeline("default", true, scene, [
    cameras.mmdCamera,
    cameras.arcCamera,
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

  const headBone = mmdModel.skeleton!.bones.find((bone) => bone.name === "頭");

  const rotationMatrix = new Matrix();
  const cameraNormal = new Vector3();
  const cameraEyePosition = new Vector3();
  const headRelativePosition = new Vector3();

  scene.onBeforeRenderObservable.add(() => {
    const mmdCamera = cameras.mmdCamera;
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
}

export function getPostProcessor(): DefaultRenderingPipeline {
  if (!postProcessor) {
    throw new Error("DefaultPipeline is not initialized");
  }
  return postProcessor;
}
