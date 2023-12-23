"use client";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MutableRefObject, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import {
  AnimationPreset,
  AnimationPresetData,
  CharacterModel,
  CharacterModelData,
  ANIMATION_PRESETS_DATA,
  CHARACTER_MODELS_DATA,
} from "../constants";
import {
  addMmdMotion,
  createAndSetMmdModel,
} from "../babylon/mmdComponents/mmdModels";
import { BabylonMmdRuntime } from "../mmd";
import { useDispatch, useSelector, useStore } from "react-redux";
import { MmdState } from "@/app/redux/store";
import { setAnimationData } from "@/app/redux/mmd";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { Mmd } from "../babylon/baseRuntime";

type Props = {
  mmdRef: MutableRefObject<Mmd | null>;
};

function Presets(props: Props) {
  const mmdIsLoaded = useSelector((state: MmdState) => state.mmd.mmdIsLoaded);
  const animationData = useSelector(
    (state: MmdState) => state.mmd.animationData,
  );
  const dispatch = useDispatch();
  const store = useStore<MmdState>();

  const onCharacterSelect = (index: number) => {
    const changeCharacterFunction = async (item: CharacterModelData) => {
      const currentAnimationData = store.getState().mmd.animationData;

      await createAndSetMmdModel(index, props.mmdRef.current, item);
      await addMmdMotion(
        index,
        props.mmdRef.current,
        currentAnimationData.modelAnimationPaths[0],
      );
      console.log(props.mmdRef.current.mmdRuntime.models[0].currentAnimation);
      console.log(props.mmdRef.current.mmdRuntime.isAnimationPlaying);
    };
    return changeCharacterFunction;
  };

  const onAnimationSelect = (item: AnimationPresetData) => {
    dispatch(setAnimationData(item));
    const audioPlayer: StreamAudioPlayer = new StreamAudioPlayer(
      props.mmdRef.current.scene,
    );
    audioPlayer.source = item.audioPath;
    props.mmdRef.current.mmdRuntime.setAudioPlayer(audioPlayer);
    props.mmdRef.current.mmdRuntime.playAnimation();
    console.log(props.mmdRef.current.mmdRuntime.models[0]);
    //update animations of loaded models
  };

  return (
    <>
      <Box as="label" display="block" mb={1}>
        {"Character Models"}
      </Box>
      {animationData.modelAnimationPaths.map((item, index) => (
        <Dropdown
          key={index}
          onMenuItemSelect={onCharacterSelect(index)}
          menuItems={CHARACTER_MODELS_DATA}
          defaultItem={CharacterModel.HATSUNE_MIKU_YYB_10TH}
          isInitializing={!mmdIsLoaded}
        />
      ))}

      <Dropdown
        menuLabel="Animation Name"
        onMenuItemSelect={onAnimationSelect}
        menuItems={ANIMATION_PRESETS_DATA}
        defaultItem={AnimationPreset.LAST_CHRISTMAS}
        isInitializing={!mmdIsLoaded}
      />
    </>
  );
}

export default Presets;
