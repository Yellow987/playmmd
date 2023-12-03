import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setIsMuted, setVolume } from "@/app/redux/controls";
import { getMmdRuntime } from "../../babylon/mmdComponents/mmdRuntime";

function Volume() {
  const volume = useSelector((state: RootState) => state.controls.volume);
  const isMuted = useSelector((state: RootState) => state.controls.isMuted);
  const dispatch = useDispatch();
  const [isHovering, setIsHovering] = useState(false);

  const setMmdVolume = (newVolume: number) => {
    dispatch(setVolume(newVolume / 100));
  };

  const toggleIsMuted = () => {
    dispatch(setIsMuted(!isMuted));
  };

  return (
    <HStack
      paddingLeft={4}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box
        width={isHovering ? "150px" : "0px"} // Adjust width as needed
        overflow="hidden"
        transition="width 0.3s ease-in-out" // Smooth transition for expanding and collapsing
      >
        <Slider
          aria-label="volume-slider"
          orientation="horizontal"
          value={volume * 100}
          onChange={(sliderValue) => {
            setMmdVolume(sliderValue);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <IconButton
        aria-label="Volume"
        icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        variant="ghost"
        onClick={toggleIsMuted}
      />
    </HStack>
  );
}

export default Volume;
