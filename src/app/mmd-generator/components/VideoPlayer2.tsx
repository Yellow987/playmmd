"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { Observer } from "@babylonjs/core/Misc/observable";

const VideoPlayer2 = () => {
  const mmdRuntime = getMmdRuntime();
  function formatSecondsToMMSS(seconds: number): string {
    return format(new Date(0, 0, 0, 0, 0, seconds), "mm:ss");
  }
  const [isPlaying, setIsPlaying] = useState(mmdRuntime.isAnimationPlaying);
  const isPlayingRef = useRef(isPlaying);
  const [preSeekIsPlaying, setPreSeekIsPlaying] = useState<Boolean>(mmdRuntime.isAnimationPlaying)
  const shouldPlayOneFrame = useRef(false);
  const shouldPauseAnimation = useRef(false);
  const tryingToPlayAnimation = useRef(false);
  const [second, setSecond] = useState(0);
  const [frame, setFrame] = useState(0);
  const [volume, setVolume] = useState(100);
  const [endSecond, setEndSecond] = useState(mmdRuntime.animationDuration);

  useEffect(() => {
    const onPlayAnimationObserver: Observer<void> =
      mmdRuntime.onPlayAnimationObservable.add(() => {
        isPlayingRef.current = true;
      });

    const onPauseAnimationObserver: Observer<void> =
      mmdRuntime.onPauseAnimationObservable.add(() => {
        isPlayingRef.current = false;
      });

    const onSeekAnimationObserver: Observer<void> =
      mmdRuntime.onSeekAnimationObservable.add(() => {
        console.log("seeking")
      });

    const onTickAnimatinoObserver: Observer<void> =
      mmdRuntime.onAnimationTickObservable.add(() => {
        if (tryingToPlayAnimation.current) {
          tryingToPlayAnimation.current = false;
        }
        if (shouldPauseAnimation.current) {
          mmdRuntime.pauseAnimation();
          shouldPauseAnimation.current = false;
        } else {
          setSecond(mmdRuntime.currentTime);
          setFrame(mmdRuntime.currentFrameTime);
        }
      });

    const onVolumeChangeObserver: Observer<void> | undefined =
      mmdRuntime.audioPlayer?.onDurationChangedObservable.add(() => {
        setEndSecond(mmdRuntime.audioPlayer?.duration || 0);
      });

    return () => {
      // Use the observable's remove method to unsubscribe
      mmdRuntime.onPlayAnimationObservable.remove(onPlayAnimationObserver);
      mmdRuntime.onPauseAnimationObservable.remove(onPauseAnimationObserver);
      mmdRuntime.onSeekAnimationObservable.remove(onSeekAnimationObserver);
      mmdRuntime.onAnimationTickObservable.remove(onTickAnimatinoObserver);
      if (onVolumeChangeObserver) {
        mmdRuntime.audioPlayer?.onDurationChangedObservable.remove(
          onVolumeChangeObserver,
        );
      }
    };
  }, []);

  const seekMmdAnimation = async (sliderValue: number) => {
    doLogging()
    const second = (sliderValue / 100) * mmdRuntime.animationDuration;
    mmdRuntime.seekAnimation(
      second * 30,
    );
    setSecond(second);
    if (!shouldPauseAnimation.current) {
      shouldPauseAnimation.current = true;
      tryToPlayAnimation();
    }
  }

  const tryToPlayAnimation = () => {
    if (tryingToPlayAnimation.current) {
      return;
    }
    tryingToPlayAnimation.current = true;
    mmdRuntime.playAnimation()
  }
  
  const pauseAnimation = () => {
    shouldPauseAnimation.current = true;
    setIsPlaying(false)
  }

  const playAnimation = () => {
    // shouldPauseAnimation.current = false;
    doLogging()
    tryToPlayAnimation();
    setIsPlaying(true)
  }

  function doLogging() {
    console.log("shouldPlayAnimation.current:" + tryingToPlayAnimation.current)
    console.log("isPlayingRef.current:" + isPlayingRef.current)
    console.log("shouldPauseAnimation.current:" + shouldPauseAnimation.current)
  }
  

  return (
    <Flex align="center" justify="center" mx={4}>
      <Button
        onClick={() =>
          isPlaying
            ? pauseAnimation()
            : playAnimation()
        }
        size="sm"
        mr={4}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </Button>

      <Box flex="1" mr={4}>
        <Slider
          aria-label="seek-slider"
          value={(second / mmdRuntime.animationDuration) * 100}
          step={0.1}
          onChange={(sliderValue) => {
            //mmdRuntime.playAnimation();
            seekMmdAnimation(sliderValue);
            //mmdRuntime.pauseAnimation();
          }}
          onChangeStart={(sliderValue) => {
            setPreSeekIsPlaying(isPlaying);
            //seekMmdAnimation(sliderValue);
            // console.log("before:" + preSeekIsPlaying);
            //mmdRuntime.pauseAnimation();
          }}
          onChangeEnd={(sliderValue) => {
            //seekMmdAnimation(val);
            console.log("after:" + preSeekIsPlaying);
            seekMmdAnimation(sliderValue);
            if (preSeekIsPlaying) {
              tryToPlayAnimation();
            }
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb w={3} h={6} />
        </Slider>
      </Box>
      <Text minWidth="50px" textAlign="center">
        {formatSecondsToMMSS(second)}/{formatSecondsToMMSS(endSecond)}
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

export default VideoPlayer2;
