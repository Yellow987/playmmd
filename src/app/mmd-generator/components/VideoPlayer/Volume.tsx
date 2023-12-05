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
