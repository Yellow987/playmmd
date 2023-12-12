"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import { createMmdRuntime, getMmdRuntime } from "../../babylon/bad/mmdRuntime";
import { format, set } from "date-fns";
import { Observer } from "@babylonjs/core/Misc/observable";
import Slider from "./Slider";
import Volume from "./Volume";
import PlayPauseButton from "./PlayPauseButton";
import { BaseRuntime } from "../../babylon/baseRuntime";
import Duration from "./Duration";
import useMmdMotions from "../../babylon/bad/useMmdMotions";
import { getScene } from "../../babylon/bad/scene";
import { createPostProcessor } from "../../babylon/bad/postProcessing";
import { createArcCamera, createMmdCamera } from "../../babylon/bad/cameras";
import { VmdLoader } from "babylon-mmd/esm/Loader/vmdLoader";
import { createAndSetMmdModel } from "../../babylon/mmdComponents/mmdModels";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { useLights } from "../../babylon/bad/lighting";
import { createShadowGenerator } from "../../babylon/bad/shadowGenerator";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
  CHARACTER_MODELS_DATA,
  CharacterModel,
} from "../../constants";
import { createAudioPlayer } from "../../babylon/bad/audioPlayer";

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
}

const VideoPlayer = (props: Props) => {
  return (
    <VStack mx={2}>
      {/* <Slider second={second} setSecond={setSecond} setFrame={setFrame} />
      <Flex align="center" w="full" marginTop={-2}>
        <Spacer />
        <PlayPauseButton />
        <Spacer />
        <Flex align="center" position="absolute" right={0}>
          <Duration second={second} endSecond={endSecond} />
          <Volume />
        </Flex>
      </Flex> */}
    </VStack>
  );
};

export default VideoPlayer;
