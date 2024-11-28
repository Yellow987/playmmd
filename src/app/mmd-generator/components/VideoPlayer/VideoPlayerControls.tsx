"use client";
import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import Slider from "./Slider";
import Volume from "./Volume";
import PlayPauseButton from "./PlayPauseButton";
import Duration from "./Duration";

const VideoPlayerControls = () => {
  return (
    <VStack mx={2}>
      <Slider />
      <Flex align="center" w="full" marginTop={-2}>
        <Spacer />
        <PlayPauseButton />
        <Spacer />
        <Flex align="center" position="absolute" right={0}>
          <Duration />
          <Volume />
        </Flex>
      </Flex>
    </VStack>
  );
};

export default VideoPlayerControls;
