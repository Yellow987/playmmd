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

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
}

const VideoPlayer = (props: Props) => {
  const mmdRuntime = getMmdRuntime();
  function formatSecondsToMMSS(seconds: number): string {
    return format(new Date(0, 0, 0, 0, 0, seconds), "mm:ss");
  }
  const [second, setSecond] = useState(0);
  const [frame, setFrame] = useState(0);
  const [endSecond, setEndSecond] = useState(mmdRuntime.animationDuration);

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
          <Text minWidth="50px" textAlign="center">
            {formatSecondsToMMSS(second)}/{formatSecondsToMMSS(endSecond)}
          </Text>
          <Volume />
        </Flex>
      </Flex>
    </VStack>
  );
};

export default VideoPlayer;
