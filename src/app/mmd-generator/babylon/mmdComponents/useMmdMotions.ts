import { RootState } from "@/app/redux/store";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
  AnimationPresetData,
  ModelAniamtionPaths,
} from "../../constants";
import { Scene } from "@babylonjs/core";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { setMmdMotions } from "@/app/redux/mmdMotions";
import { MmdModel } from "babylon-mmd";

const useMmdMotions = (
  scene: Scene,
  mmdRuntime: MmdRuntime,
  mmdRuntimeModels: MmdModel[],
): void => {
  const dispatch = useDispatch();
  const mmdMotions: AnimationPreset[] = useSelector(
    (state: RootState) => state.mmdMotions.motions,
  );

  useEffect(() => {
    dispatch(setMmdMotions([AnimationPreset.LAST_CHRISTMAS]));
  }, []);

  useEffect(() => {
    const index = 0;
    console.log(mmdMotions, mmdRuntimeModels);
    if (!mmdMotions[index] || !mmdRuntimeModels[index]) return;
    setMmdMotionOnModel(index, mmdMotions[index]);
  }, [mmdMotions, mmdRuntimeModels]);

  async function setMmdMotionOnModel(
    index: number,
    animationPreset: AnimationPreset,
  ): Promise<void> {
    const orderedKeys: (keyof ModelAniamtionPaths)[] = [
      "skeletonPath",
      "facialPath",
      "lipsPath",
    ];
    console.log(ANIMATION_PRESETS_DATA[animationPreset].modelAnimationPaths[0]);
    const animationPaths: ModelAniamtionPaths =
      ANIMATION_PRESETS_DATA[animationPreset].modelAnimationPaths[0];
    const OrderedModelAnimationArray: string[] = orderedKeys
      .map((key) => animationPaths[key])
      .filter((path): path is string => path !== undefined);

    const vmdLoader = new VmdLoader(scene);
    const modelMotion = await vmdLoader.loadAsync(
      "Model_Animation",
      OrderedModelAnimationArray, //Refactor to ? : ""
    );

    const mmdModel = mmdRuntimeModels[index];
    mmdModel.addAnimation(modelMotion);
    mmdModel.setAnimation("Model_Animation");
  }
};

export default useMmdMotions;
