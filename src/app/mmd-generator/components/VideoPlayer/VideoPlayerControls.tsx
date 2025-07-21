"use client";
import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import Slider from "./Slider";
import Volume from "./Volume";
import PlayPauseButton from "./PlayPauseButton";
import Duration from "./Duration";
import ScreenshotButton from "./ScreenshotButton";
import FullscreenButton from "./FullscreenButton";
import React from "react";

interface Props {
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null>;
  sceneRef?: React.MutableRefObject<any | null>;
}

const VideoPlayerControls: React.FC<Props> = ({ canvasRef, sceneRef }) => {
  return (
    <VStack mx={2}>
      <Slider />
      <Flex align="center" w="full" marginTop={-2}>
        <Spacer />
        <PlayPauseButton />
        {canvasRef && sceneRef && (
          <ScreenshotButton canvasRef={canvasRef} sceneRef={sceneRef} />
        )}
        <Spacer />
        <Flex align="center" position="absolute" right={0}>
          <Duration />
          <Volume />
          <FullscreenButton />
        </Flex>
      </Flex>
    </VStack>
  );
};

export default VideoPlayerControls;
