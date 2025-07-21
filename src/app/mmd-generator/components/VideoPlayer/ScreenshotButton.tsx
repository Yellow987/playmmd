"use client";
import React from "react";
import { Button, Icon, useToast } from "@chakra-ui/react";
import { MdCameraAlt } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCapturedScreenshot, setIsCapturing } from "@/redux/screenshot";
import {
  captureCanvasScreenshot,
  optimizeImageFile,
} from "@/utils/screenshotCapture";

interface Props {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  sceneRef: React.MutableRefObject<any | null>;
}

const ScreenshotButton: React.FC<Props> = ({ canvasRef, sceneRef }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isCapturing } = useSelector((state: RootState) => state.screenshot);
  const { isPlaying } = useSelector((state: RootState) => state.mmd);

  const handleScreenshotCapture = async () => {
    if (!canvasRef.current) {
      toast({
        title: "Error",
        description: "Canvas not available for screenshot",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      dispatch(setIsCapturing(true));

      // Capture the screenshot from the main canvas
      const screenshotFile = await captureCanvasScreenshot(
        canvasRef.current,
        sceneRef.current,
        `screenshot_${Date.now()}.jpg`,
        0.9,
      );

      // Optimize the screenshot for thumbnail use
      const optimizedScreenshot = await optimizeImageFile(
        screenshotFile,
        800,
        0.8,
      );

      // Convert file to data URL for display
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(optimizedScreenshot);
      });

      // Store both file and data URL in Redux
      dispatch(setCapturedScreenshot({ file: optimizedScreenshot, dataUrl }));

      toast({
        title: "Screenshot Captured",
        description: "Screenshot saved and ready for use as thumbnail",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      dispatch(setIsCapturing(false));

      toast({
        title: "Screenshot Failed",
        description: "Failed to capture screenshot. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      onClick={handleScreenshotCapture}
      size="sm"
      mx={1}
      isLoading={isCapturing}
      loadingText="Capturing..."
      variant="outline"
      colorScheme="blue"
      aria-label="Capture Screenshot"
      title="Capture current frame as screenshot"
    >
      <Icon as={MdCameraAlt} />
    </Button>
  );
};

export default ScreenshotButton;
