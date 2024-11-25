"use client"
import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  SliderTrack,
  SliderThumb,
  Box,
  HStack,
} from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider"
import { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { getAudioPlayer } from "../../babylon/mmdComponents/audioPlayer";

function Volume() {
  const audioPlayer = getAudioPlayer();
  const [volume, setVolume] = useState(audioPlayer.volume * 100);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const setMmdVolume = (newVolume: number) => {
    audioPlayer.volume = newVolume / 100;
    setVolume(newVolume);
  };

  const toggleIsMuted = () => {
    if (!isMuted) {
      audioPlayer.mute();
    } else {
      audioPlayer.unmute();
    }
    setIsMuted(!isMuted);
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
          value={volume}
          onChange={(sliderValue: number) => {
            setMmdVolume(sliderValue);
          }}
        >
          <SliderTrack>
            <Box position="relative" width="100%" height="100%" bg="blue.500" />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <IconButton aria-label="Volume" variant="ghost" onClick={toggleIsMuted}>
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </IconButton>
    </HStack>
  );
}

export default Volume;
