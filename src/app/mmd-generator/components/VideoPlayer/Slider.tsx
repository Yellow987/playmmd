import {
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Slider as ChakraSlider,
} from "@chakra-ui/react";
import { getMmdRuntime } from "../../babylon/mmdComponents/mmdRuntime";
import { useEffect, useRef, useState } from "react";

interface Props {
  second: number;
  setSecond: (newSecond: number) => void;
  setFrame: (newFrame: number) => void;
}

function Slider(props: Props) {
  //const { second, setSecond, setFrame } = props;
  //const mmdRuntime = getMmdRuntime();
  const wasPlayingRef = useRef(false);
  const [num, setNum] = useState(0);

  // const onSeek = (seekTo: number) => {
  //   const newSecond = (seekTo / 100) * mmdRuntime.animationDuration;
  //   //setSecond(newSecond);
  //   //setFrame(Math.round(newSecond * 30));
  //   mmdRuntime.seekAnimation(newSecond * 30, true);
  // };

  useEffect(() => {
    const updater = setInterval(() => {
      setNum((num) => num + 0.02);
    }, 500);

    return () => {
      clearInterval(updater);
    };
  }, []);

  return (
    <ChakraSlider
      mx={40}
      aria-label="seek-slider"
      value={(num / 250) * 100}
      step={0.1}
      // onChange={(sliderValue) => {
      //   onSeek(sliderValue);
      // }}
      // onChangeStart={() => {
      //   wasPlayingRef.current = mmdRuntime.isAnimationPlaying;
      //   mmdRuntime.pauseAnimation();
      // }}
      // onChangeEnd={() => {
      //   if (wasPlayingRef.current) mmdRuntime.playAnimation();
      // }}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </ChakraSlider>
  );
}

export default Slider;
