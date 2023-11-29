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
  const preSeekIsPlayingRef = useRef(false);
  const isSeekingRef = useRef(false);
  const sholdPlayRef = useRef(false);
  const [second, setSecond] = useState(0);
  const [frame, setFrame] = useState(0);
  const [volume, setVolume] = useState(100);
  const [endSecond, setEndSecond] = useState(mmdRuntime.animationDuration);

  useEffect(() => {
    const onPlayAnimationObserver: Observer<void> =
      mmdRuntime.onPlayAnimationObservable.add(() => {
        isPlayingRef.current = true;
        console.log("PLAYING ---------------------------------------")
      });

    const onPauseAnimationObserver: Observer<void> =
      mmdRuntime.onPauseAnimationObservable.add(() => {
        isPlayingRef.current = false;
        console.log("Paused D:")
      });

    // const onSeekAnimationObserver: Observer<void> =
    //   mmdRuntime.onSeekAnimationObservable.add(() => {
    //   });

    const onTickAnimatinoObserver: Observer<void> =
      mmdRuntime.onAnimationTickObservable.add(() => {
        console.log("TICK")
        if (isSeekingRef.current) {
          mmdRuntime.pauseAnimation();
          console.log("Pausing attempt !")
          isSeekingRef.current = false;
        } else {
          //These lines prevent freecam from working. but i need state update on frame change. or i can check them every 100ms
          //maybe make the second a useRef, but make a state update every 100ms
          //or why make a useRef at all just have a time update second frequently
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
      //mmdRuntime.onSeekAnimationObservable.remove(onSeekAnimationObserver);
      mmdRuntime.onAnimationTickObservable.remove(onTickAnimatinoObserver);
      if (onVolumeChangeObserver) {
        mmdRuntime.audioPlayer?.onDurationChangedObservable.remove(
          onVolumeChangeObserver,
        );
      }
    };
  }, []);

  const seekMmdAnimation = (sliderValue: number) => {
    const second = (sliderValue / 100) * mmdRuntime.animationDuration;
    mmdRuntime.seekAnimation(
      second * 30,
    );
    setSecond(second);
    isSeekingRef.current = true;
    console.log("seeking animation, isPlaying: " + isPlayingRef.current )
    if (!isPlayingRef.current) {
      mmdRuntime.playAnimation();
    }
  }
  
  const pauseAnimation = () => {
    mmdRuntime.pauseAnimation()
    setIsPlaying(false)
  }

  const playAnimation = () => {
    mmdRuntime.playAnimation()
    setIsPlaying(true)
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
          // onChangeStart={(sliderValue) => {
          //   preSeekIsPlayingRef.current = isPlaying
          //   //seekMmdAnimation(sliderValue);
          //   // console.log("before:" + preSeekIsPlaying);
          //   //mmdRuntime.pauseAnimation();
          // }}
          onChangeEnd={(sliderValue) => {
            //seekMmdAnimation(val);
            //seekMmdAnimation(sliderValue);
            if (isPlaying && !isSeekingRef.current) { //mmdPlayanimation resolved
              console.log("MMD resolved, playing again")
              mmdRuntime.playAnimation();
            }
            else if (isPlaying) { //mmdPlayanimation next tick not occured yet
              console.log("MMD Play STILL PENDING, not playing animation, isplaying:" + isPlayingRef.current)
              isSeekingRef.current = false;
              if (!isPlayingRef.current) { //
                mmdRuntime.playAnimation();
              } else {
                mmdRuntime.playAnimation();
              }
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
