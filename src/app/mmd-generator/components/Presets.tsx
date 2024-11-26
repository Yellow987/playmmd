"use client";
import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import {
  AnimationPreset,
  AnimationPresetData,
  CharacterModel,
  AwsAsset,
  ANIMATION_PRESETS_DATA,
  CHARACTER_MODELS_DATA,
  STAGE_DATA,
} from "../constants";
import PlayerManager from "../babylon/mmdComponents/PlayerManager";
import { cleanupAllModels, cleanupModel, cleanupModelInArray } from "../babylon/mmdComponents/mmdModels";
import { MmdModel } from "babylon-mmd";

export type MmdDancer = {
  modelData: AwsAsset | null;
  isModelLoaded: boolean;
  animationData: AnimationPresetData | null;
  isAnimationLoaded: boolean;
};


function Presets() {

  const [mmdDancers, setMmdDancers] = useState<MmdDancer[]>([{
    modelData: null,
    isModelLoaded: false,
    animationData: null,
    isAnimationLoaded: false,
  }]);
  const isModelLoading = useRef([false]);
  const playerManager: PlayerManager = new PlayerManager(setMmdDancers);

  useEffect(() => {
    let isCancelled = false;
    const loadModel = async (characterModel: AwsAsset, i: number) => {
      const mmdModel: MmdModel = await playerManager.setMmdModel(0, characterModel);
      isModelLoading.current[i] = false;
      
      if (isCancelled) {
        cleanupModel(mmdModel);
      };
    }

    mmdDancers.forEach((mmdDancer, i) => {
      if (mmdDancer.modelData && !mmdDancer.isModelLoaded && !isModelLoading.current[i]) {
        isModelLoading.current[i] = true;
        loadModel(mmdDancer.modelData, i);
      }
      if (mmdDancer.isModelLoaded && mmdDancer.animationData && !mmdDancer.isAnimationLoaded) {
        playerManager.setMmdAnimation(i, mmdDancer.animationData);
      }
    });
    

    return () => {
      isCancelled = true;
    };
  }, [mmdDancers]);

  const onCharacterSelect = async (characterModelData: AwsAsset) => {
    if (mmdDancers[0].modelData && !mmdDancers[0].isModelLoaded) return;
    await playerManager.setMmdModel(0, characterModelData);

    setMmdDancers((prev) => {
      const newMmdDancers = [...prev];
      newMmdDancers[0] = {
        modelData: characterModelData,
        isModelLoaded: false,
        animationData: prev[0]?.animationData || null,
        isAnimationLoaded: false,
      };
      return newMmdDancers;
    });
  };

  const onStageSelect = async (stage: string) => {cleanupAllModels();};

  const onAnimationSelect = async (
    animationPresetData: AnimationPresetData,
  ) => {
    setMmdDancers((prev) => {
      const newMmdDancers = [...prev];
      newMmdDancers[0] = {
        modelData: prev[0]?.modelData || null,
        isModelLoaded: prev[0]?.isModelLoaded || false,
        animationData: animationPresetData,
        isAnimationLoaded: false,
      };
      return newMmdDancers;
    });
  }

  return (
    <>
      <Dropdown
        menuLabel="Character Model"
        onMenuItemSelect={onCharacterSelect}
        menuItems={CHARACTER_MODELS_DATA}
        defaultItem={CharacterModel.HATSUNE_MIKU_YYB_10TH}
      />

      <Dropdown
        menuLabel="Stage"
        onMenuItemSelect={onStageSelect}
        menuItems={STAGE_DATA}
        defaultItem={"DefaultStage"}
      />

      <Dropdown
        menuLabel="Animation Name"
        onMenuItemSelect={onAnimationSelect}
        menuItems={ANIMATION_PRESETS_DATA}
        defaultItem={AnimationPreset.FIGHTING_MY_WAY}
      />
    </>
  );
}

export default Presets;
