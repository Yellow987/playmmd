import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect, MutableRefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
  AnimationPresetData,
  ModelAniamtionPaths,
} from "../../constants";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import { Scene } from "@babylonjs/core/scene";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { RootState } from "@/redux/store";
import { MotionData } from "@/redux/mmdMotions";
import {
  downloadFromAmplifyStorageAsFile,
  downloadFromAmplifyStorageAsUrl,
} from "@/app/amplifyHandler/amplifyHandler";
import { MmdViewerMode } from "../../MmdViewer";

const useMmdMotions = (
  sceneRef: MutableRefObject<Scene>,
  mmdCharacterModelsRef: MutableRefObject<MmdModel[]>,
  mode: MmdViewerMode = "editor",
): void => {
  const dispatch = useDispatch();
  const mmdMotions: MotionData[] = useSelector(
    (state: RootState) => state.mmdMotions.motions,
  );
  const mmdModelsLoaded = useSelector(
    (state: RootState) => state.mmdModels.modelsLoaded,
  );

  useEffect(() => {
    // Don't load motions in builder mode, but allow in viewer and editor modes
    if (mode === "builder") return;

    const index = 0;
    if (
      !mmdMotions[index] ||
      !mmdCharacterModelsRef.current[index] ||
      !mmdModelsLoaded
    )
      return;
    setMmdMotionOnModel(index, mmdMotions[index]);
  }, [mmdMotions, mmdModelsLoaded, mode]);

  async function setMmdMotionOnModel(
    index: number,
    motionData: MotionData,
  ): Promise<void> {
    const vmdLoader = new VmdLoader(sceneRef.current);
    console.log("Loading motion");
    let motions: any[] = [];
    if (!motionData.isLocalMotion) {
      // For remote motions, try to load each file but filter out failed loads
      const motionPromises = motionData.motions.map(async (motionPath) => {
        try {
          return await downloadFromAmplifyStorageAsUrl(motionPath);
        } catch (error) {
          console.log(`Failed to load motion file: ${motionPath}`, error);
          return null;
        }
      });
      const motionResults = await Promise.all(motionPromises);
      motions = motionResults.filter((motion) => motion !== null);
    } else {
      motions = motionData.motions;
    }
    const mmdModel = mmdCharacterModelsRef.current[index];
    // mmdModel.removeAnimation(0);
    console.log("Motions", motions);

    // Load all motion files (main motion, facial expression, lipsync) and merge them
    const modelMotion = await vmdLoader.loadAsync("model_motion_1", motions);
    console.log("Motion loaded", modelMotion);

    mmdModel.addAnimation(modelMotion);
    mmdModel.setAnimation("model_motion_1");
  }
};

export default useMmdMotions;
