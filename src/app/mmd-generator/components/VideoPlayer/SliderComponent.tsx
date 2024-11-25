"use client";
import {
  SliderTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider"
import { getMmdRuntime } from "../../babylon/mmdComponents/mmdRuntime";
import { useEffect, useRef, useState } from "react";

interface Props {
  second: number;
  setSecond: (newSecond: number) => void;
  setFrame: (newFrame: number) => void;
}

function SliderComponent(props: Props) {
  const { second, setSecond, setFrame } = props;
  const mmdRuntime = getMmdRuntime();
  const wasPlayingRef = useRef(false);
  const [num, setNum] = useState(0);

  const onSeek = (seekTo: number) => {
    const newSecond = (seekTo / 100) * mmdRuntime.animationDuration;
    setSecond(newSecond);
    setFrame(Math.round(newSecond * 30));
    mmdRuntime.seekAnimation(newSecond * 30, true);
  };

  return ( <></>
    // <Slider
    //   mx={40}
    //   aria-label="seek-slider"
    //   focusThumbOnChange={false}
    //   value={[(second / mmdRuntime.animationDuration) * 100]}
    //   step={0.1}
    //   onChange={(sliderValue: number) => {
    //     onSeek(sliderValue);
    //   }}
    //   onChangeStart={() => {
    //     wasPlayingRef.current = mmdRuntime.isAnimationPlaying;
    //     mmdRuntime.pauseAnimation();
    //   }}
    //   onChangeEnd={() => {
    //     if (wasPlayingRef.current) mmdRuntime.playAnimation();
    //   }}
    // >
    //   <SliderTrack>
    //     <Box position="relative" width="100%" height="100%" bg="blue.500" />
    //   </SliderTrack>
    //   <SliderThumb />
    // </Slider>
  );
}

export default SliderComponent;
