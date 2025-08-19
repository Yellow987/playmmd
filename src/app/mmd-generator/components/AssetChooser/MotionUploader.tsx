import React, { useRef, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  Tag,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setAudioPath } from "@/redux/audio";
import { setMmdMotions, MotionData } from "@/redux/mmdMotions";
import { MotionFiles } from "./MmdAssetChooserModal";
import { setFps, setSecond } from "@/redux/mmd";
import { setMmdCameraData, CameraData } from "@/redux/cameras";
import { getMmdRuntime } from "../../babylon/mmdHooks/mmdRuntime";

interface Props {
  motionData: MotionFiles;
  setMotionData: React.Dispatch<React.SetStateAction<MotionFiles>>;
  onComplete: () => void;
}

const MotionUploader = (props: Props) => {
  const { motionData, setMotionData, onComplete } = props;
  const dispatch = useDispatch();
  const fpsRef = useRef<HTMLInputElement>(null);
  const [isUsingMotion, setIsUsingMotion] = useState(false);

  const handleSongUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setMotionData((prev) => ({
      ...prev,
      songFile: e.target.files![0],
    }));
  };

  const handleMotionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setMotionData((prev) => ({
      ...prev,
      motionsFiles: [e.target.files![0]],
    }));
  };

  const handleCameraUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setMotionData((prev) => ({
      ...prev,
      cameraFile: e.target.files![0],
    }));
  };

  const handleLipsyncUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setMotionData((prev) => ({
      ...prev,
      lipsyncFile: e.target.files![0],
    }));
  };

  const handleFacialExpressionUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    setMotionData((prev) => ({
      ...prev,
      facialExpressionFile: e.target.files![0],
    }));
  };

  const handleUseClick = async () => {
    setIsUsingMotion(true);
    try {
      const audioPath = URL.createObjectURL(motionData.songFile!);
      dispatch(setAudioPath({ audioPath, isLocalAudio: true }));
      dispatch(setFps(Number(fpsRef.current?.value)));
      getMmdRuntime().seekAnimation(0, true);
      dispatch(setSecond(0));

      const mmdMotionPath = URL.createObjectURL(motionData.motionsFiles[0]);
      const motionPaths = [mmdMotionPath];

      // Add facial expression file if available
      if (motionData.facialExpressionFile) {
        const facialPath = URL.createObjectURL(motionData.facialExpressionFile);
        motionPaths.push(facialPath);
      }

      // Add lipsync file if available
      if (motionData.lipsyncFile) {
        const lipsyncPath = URL.createObjectURL(motionData.lipsyncFile);
        motionPaths.push(lipsyncPath);
      }

      dispatch(
        setMmdMotions([
          {
            motions: motionPaths,
            isLocalMotion: true,
          } as MotionData,
        ]),
        motionData.cameraFile &&
          dispatch(
            setMmdCameraData({
              cameraPath: URL.createObjectURL(motionData.cameraFile!),
              isLocalMotion: true,
            } as CameraData),
          ),
      );

      onComplete();
    } finally {
      setIsUsingMotion(false);
    }
  };

  return (
    <VStack spacing={6} p={6} align="start" maxW="400px" mx="auto">
      <Box w="full">
        <Heading size="md" mb={2}>
          Song
        </Heading>
        <Input type="file" accept="audio/*" onChange={handleSongUpload} />
        {motionData.songFile && (
          <Text mt={2} fontSize="sm">
            Uploaded: {motionData.songFile.name}
          </Text>
        )}
      </Box>

      <Box w="full">
        <Heading size="md" mb={2}>
          Motion
        </Heading>
        <Input type="file" accept=".vmd" onChange={handleMotionUpload} />
        {motionData.motionsFiles[0] && (
          <Text mt={2} fontSize="sm">
            Uploaded: {motionData.motionsFiles[0].name}
          </Text>
        )}
      </Box>

      <Box w="full">
        <Heading size="md" mb={2}>
          Camera
        </Heading>
        <Input type="file" accept=".vmd" onChange={handleCameraUpload} />
        {motionData.cameraFile && (
          <Text mt={2} fontSize="sm">
            Uploaded: {motionData.cameraFile.name}
          </Text>
        )}
      </Box>

      <Box w="full">
        <Heading size="md" mb={2}>
          Lipsync (Optional)
        </Heading>
        <Input type="file" accept=".vmd" onChange={handleLipsyncUpload} />
        {motionData.lipsyncFile && (
          <Text mt={2} fontSize="sm">
            Uploaded: {motionData.lipsyncFile.name}
          </Text>
        )}
      </Box>

      <Box w="full">
        <Heading size="md" mb={2}>
          Facial Expression (Optional)
        </Heading>
        <Input
          type="file"
          accept=".vmd"
          onChange={handleFacialExpressionUpload}
        />
        {motionData.facialExpressionFile && (
          <Text mt={2} fontSize="sm">
            Uploaded: {motionData.facialExpressionFile.name}
          </Text>
        )}
      </Box>

      <Box w="full">
        <Heading size="md" mb={2}>
          FPS
        </Heading>
        <HStack>
          <NumberInput min={1} defaultValue={30}>
            <NumberInputField ref={fpsRef} />
          </NumberInput>
          <Tag>FPS</Tag>
        </HStack>
      </Box>

      <HStack w="full" justifyContent="center">
        <Button
          colorScheme="blue"
          onClick={handleUseClick}
          isDisabled={!motionData.songFile || !motionData.motionsFiles[0]}
          isLoading={isUsingMotion}
          loadingText="Loading..."
        >
          Use
        </Button>
      </HStack>
    </VStack>
  );
};

export default MotionUploader;
