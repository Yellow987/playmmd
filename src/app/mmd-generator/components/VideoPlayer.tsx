"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
  useBoolean,
  VStack,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import { getMmdRuntime } from "../babylon/mmdComponents/mmdRuntime";
import { format } from "date-fns";

const SceneControls = () => {
  function formatSecondsToMMSS(seconds: number): string {
    return format(new Date(0, 0, 0, 0, 0, seconds), "mm:ss");
  }
  const [isPlaying, setIsPlaying] = useBoolean(true);
  const [volume, setVolume] = useState(100);
  const [second, setSecond] = useState(0);
  const [frame, setFrame] = useState(0);
  const mmdRuntime = getMmdRuntime();
  const timeDuration = formatSecondsToMMSS(mmdRuntime.animationDuration);
  const updateFrequency = 100; //ms

  useEffect(() => {
    if (isPlaying) {
      mmdRuntime.playAnimation();
    } else {
      mmdRuntime.pauseAnimation();
    }
  }, [isPlaying]);

  useEffect(() => {
    const diff = Math.abs(mmdRuntime.currentTime - second);
    if (!isPlaying && diff > updateFrequency / 1000) {
      console.log("seeked");
      console.log(diff);
      console.log(mmdRuntime.currentTime);
      console.log(second);
      mmdRuntime.playAnimation();
      mmdRuntime.seekAnimation(second * 30);
      mmdRuntime.pauseAnimation();
      return;
    }
    let animationTimer: NodeJS.Timeout;

    const updateCurrentSecond = () => {
      const mmdSecond: number = mmdRuntime.currentTime;
      const mmdFrame: number = mmdRuntime.currentFrameTime;
      setSecond(mmdSecond);
      setFrame(mmdFrame);
      animationTimer = setTimeout(updateCurrentSecond, updateFrequency);
    };

    updateCurrentSecond();

    // Cleanup function to clear the timer when the component unmounts
    return () => clearTimeout(animationTimer);
  }, [isPlaying, second]);

  const updateSecond = (second: number) => {
    setSecond(second);
    mmdRuntime.seekAnimation(second * 30);
  };

  return (
    <Flex align="center" justify="center" mx={4}>
      <Button onClick={setIsPlaying.toggle} size="sm" mr={4}>
        {mmdRuntime.isAnimationPlaying ? <FaPause /> : <FaPlay />}
      </Button>

      <Box flex="1" mr={4}>
        <Slider
          aria-label="seek-slider"
          value={second}
          onChange={updateSecond}
          onChangeStart={() => mmdRuntime.pauseAnimation()}
          onChangeEnd={() => mmdRuntime.playAnimation()}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <Text minWidth="50px" textAlign="center">
        {formatSecondsToMMSS(second)}/{timeDuration}
      </Text>

      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="Volume"
            icon={<FaVolumeUp />}
            variant="ghost"
          />
        </PopoverTrigger>
        <PopoverContent width="auto">
          <PopoverArrow />
          <PopoverBody>
            <VStack>
              <Slider
                aria-label="volume-slider"
                orientation="vertical"
                value={volume}
                onChange={(val) => setVolume(val)}
                h="150px"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default SceneControls;
