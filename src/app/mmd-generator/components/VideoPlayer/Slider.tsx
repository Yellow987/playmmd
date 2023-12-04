import {
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Slider as ChakraSlider,
} from "@chakra-ui/react";
import { getMmdRuntime } from "../../babylon/mmdComponents/mmdRuntime";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { setSecond } from "@/app/redux/mmd";

function Slider() {
  const second = useSelector((state: RootState) => state.mmd.second);
  const animationDuration = useSelector(
    (state: RootState) => state.mmd.animationDuration,
  );
  const dispatch = useDispatch();
  const wasPlayingRef = useRef(false);

  const onSeek = (seekTo: number) => {
    const newSecond = (seekTo / 100) * animationDuration;
    dispatch(setSecond(newSecond));
    getMmdRuntime().seekAnimation(newSecond * 30, true);
  };

  return (
    <ChakraSlider
      mx={40}
      aria-label="seek-slider"
      focusThumbOnChange={false}
      value={(second / animationDuration) * 100}
      step={0.1}
      onChange={(sliderValue) => {
        onSeek(sliderValue);
      }}
      onChangeStart={(sliderValue) => {
        wasPlayingRef.current = getMmdRuntime().isAnimationPlaying;
        getMmdRuntime().pauseAnimation();
      }}
      onChangeEnd={() => {
        if (wasPlayingRef.current) getMmdRuntime().playAnimation();
      }}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </ChakraSlider>
  );
}

export default Slider;
