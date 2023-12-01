import { RootState } from "@/redux/store";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
  AnimationPresetData,
  ModelAniamtionPaths,
} from "../../constants";
import { Scene } from "@babylonjs/core";
import { getMmdModel } from "./mmdModels";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";

const useMmdMotions = (scene: Scene, mmdRuntime: MmdRuntime): void => {
  const mmdMotions = useSelector((state: RootState) => state.mmdMotions);
  const mmdModel = getMmdModel(0);

  useEffect(() => {
    addMmdMotion(0, AnimationPreset.LAST_CHRISTMAS);
  }, []);

  async function addMmdMotion(
    index: number,
    animation: AnimationPreset,
  ): Promise<void> {
    const orderedKeys: (keyof ModelAniamtionPaths)[] = [
      "skeletonPath",
      "facialPath",
      "lipsPath",
    ];
    const animationPaths: ModelAniamtionPaths =
      ANIMATION_PRESETS_DATA[animation].modelAnimationPaths[0];
    const OrderedModelAnimationArray: string[] = orderedKeys
      .map((key) => animationPaths[key])
      .filter((path): path is string => path !== undefined);

    const vmdLoader = new VmdLoader(scene);
    const modelMotion = await vmdLoader.loadAsync(
      "Model_Animation",
      OrderedModelAnimationArray, //Refactor to ? : ""
    );

    mmdModel.addAnimation(modelMotion);
    mmdModel.setAnimation("Model_Animation");
  }
};

export default useMmdMotions;
