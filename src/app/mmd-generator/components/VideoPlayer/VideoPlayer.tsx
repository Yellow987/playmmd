"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import { getMmdRuntime } from "../../babylon/mmdComponents/mmdRuntime";
import { format, set } from "date-fns";
import { Observer } from "@babylonjs/core/Misc/observable";
import Slider from "./Slider";
import Volume from "./Volume";
import PlayPauseButton from "./PlayPauseButton";
import { BaseRuntime } from "../../babylon/baseRuntime";
import Duration from "./Duration";
import useMmdMotions from "../../babylon/mmdComponents/useMmdMotions";
import { getScene } from "../../babylon/mmdComponents/scene";
import useMmdModels from "../../babylon/mmdComponents/useMmdModels";
import usePostProcessor from "../../babylon/mmdComponents/usePostProcessor";
import useCameras from "../../babylon/mmdComponents/useCameras";
import useMmd from "../../babylon/mmdComponents/useMmd";

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
}

const VideoPlayer = (props: Props) => {
  const mmdRuntime = getMmdRuntime();
  const [second, setSecond] = useState(0);
  const [frame, setFrame] = useState(0);
  const [endSecond, setEndSecond] = useState(mmdRuntime.animationDuration);
  const scene = getScene();
  if (props.runtimeRef.current?._canvas) {
    useMmd(scene, mmdRuntime, props.runtimeRef.current._canvas);
  } else {
    throw new Error("canvas is not found");
  }

  useEffect(() => {
    const onAnimationDurationChangedObserver: Observer<void> | undefined =
      mmdRuntime.onAnimationDurationChangedObservable.add(() => {
        setEndSecond(mmdRuntime.animationDuration);
      });

    const onTickObserver: Observer<void> | undefined =
      mmdRuntime.onAnimationTickObservable.add(() => {
        setSecond(mmdRuntime.currentTime);
        setFrame(mmdRuntime.currentFrameTime);
      });

    return () => {
      mmdRuntime.onAnimationDurationChangedObservable.remove(
        onAnimationDurationChangedObserver,
      );
      mmdRuntime.onAnimationTickObservable.remove(onTickObserver);
    };
  }, []);

  return (
    <VStack mx={2}>
      <Slider second={second} setSecond={setSecond} setFrame={setFrame} />
      <Flex align="center" w="full" marginTop={-2}>
        <Spacer />
        <PlayPauseButton />
        <Spacer />
        <Flex align="center" position="absolute" right={0}>
          <Duration second={second} endSecond={endSecond} />
          <Volume />
        </Flex>
      </Flex>
    </VStack>
  );
};

export default VideoPlayer;
