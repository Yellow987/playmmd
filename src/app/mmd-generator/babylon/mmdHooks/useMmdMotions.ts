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

    // Validation: Ensure we have at least one valid motion file
    if (!motions || motions.length === 0) {
      console.error("No valid motion files to load");
      return;
    }

    const mmdModel = mmdCharacterModelsRef.current[index];
    // mmdModel.removeAnimation(0);
    console.log("Motions to load:", motions);

    try {
      let modelMotion;

      if (motions.length === 1) {
        // Single motion file - load directly
        console.log("Loading single motion file:", motions[0]);
        modelMotion = await vmdLoader.loadAsync("model_motion_1", motions[0]);
      } else {
        // Multiple motion files with consistent positioning
        // VmdLoader expects: [main, facial, lipsync] where missing files are null
        console.log("Loading multiple motion files with positioning:", motions);
        modelMotion = await vmdLoader.loadAsync("model_motion_1", motions);
      }

      console.log("Motion loaded successfully", modelMotion);
      mmdModel.addAnimation(modelMotion);
      mmdModel.setAnimation("model_motion_1");
    } catch (error) {
      console.error("Failed to load motion:", error);

      // Fallback: Try loading just the first (main) motion file
      if (motions.length > 0 && motions[0]) {
        console.log("Attempting fallback to main motion only");
        try {
          const fallbackMotion = await vmdLoader.loadAsync(
            "model_motion_1",
            motions[0],
          );
          console.log("Fallback motion loaded", fallbackMotion);

          mmdModel.addAnimation(fallbackMotion);
          mmdModel.setAnimation("model_motion_1");
        } catch (fallbackError) {
          console.error("Fallback motion loading also failed:", fallbackError);
        }
      }
    }
  }
};

export default useMmdMotions;
