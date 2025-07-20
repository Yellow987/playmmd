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
      motions = await Promise.all(
        motionData.motions.map(async (motionPath) => {
          return await downloadFromAmplifyStorageAsUrl(motionPath);
        }),
      );
    } else {
      motions = motionData.motions;
    }
    const mmdModel = mmdCharacterModelsRef.current[index];
    // mmdModel.removeAnimation(0);
    const motion = motions[0];
    console.log("Motions", motions);

    const modelMotion = await vmdLoader.loadAsync(motion, motion);
    console.log("Motion loaded", modelMotion);

    mmdModel.addAnimation(modelMotion);
    mmdModel.setAnimation(motion);
  }
};

export default useMmdMotions;
