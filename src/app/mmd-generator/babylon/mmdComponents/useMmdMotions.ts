import { RootState } from "@/app/redux/store";
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
import { setMmdMotions } from "@/app/redux/mmdMotions";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import { Scene } from "@babylonjs/core/scene";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";

const useMmdMotions = (
  sceneRef: MutableRefObject<Scene>,
  mmdCharacterModelsRef: MutableRefObject<MmdModel[]>,
): void => {
  const dispatch = useDispatch();
  const mmdMotions: AnimationPreset[] = useSelector(
    (state: RootState) => state.mmdMotions.motions,
  );
  const mmdModelsLoaded = useSelector(
    (state: RootState) => state.mmdModels.modelsLoaded,
  );

  useEffect(() => {
    const index = 0;
    if (!mmdMotions[index] || !mmdCharacterModelsRef.current[index]) return;
    setMmdMotionOnModel(index, mmdMotions[index]);
  }, [mmdMotions, mmdModelsLoaded]);

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

    const vmdLoader = new VmdLoader(sceneRef.current);
    const modelMotion = await vmdLoader.loadAsync(
      "Model_Animation",
      OrderedModelAnimationArray, //Refactor to ? : ""
    );

    const mmdModel = mmdCharacterModelsRef.current[index];
    mmdModel.addAnimation(modelMotion);
    mmdModel.setAnimation("Model_Animation");
  }
};

export default useMmdMotions;
