"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import { getMmdRuntime } from "../babylon/mmdComponents/mmdRuntime";
import { format, set } from "date-fns";
import { Observer } from "@babylonjs/core/Misc/observable";
import Slider from "./Slider";
import Volume from "./Volume";
import PlayPauseButton from "./PlayPauseButton";

const VideoPlayer = () => {
  function formatSecondsToMMSS(seconds: number): string {
    return format(new Date(0, 0, 0, 0, 0, seconds), "mm:ss");
  }
  const isSeekingRef = useRef(false);
  const [second, setSecond] = useState(0);
  const [frame, setFrame] = useState(0);
  const [randomState, setRandomState] = useState(0);

  return (
    <VStack mx={2}>
      <Slider second={second} setSecond={setSecond} setFrame={setFrame} />
      <Flex align="center" w="full" marginTop={-2}>
        <Spacer />
        <PlayPauseButton />
        <Spacer />
        <Flex align="center" position="absolute" right={0}>
          <Volume />
        </Flex>
      </Flex>
    </VStack>
  );
};

export default VideoPlayer;
