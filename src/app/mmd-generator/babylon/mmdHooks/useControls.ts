import { MutableRefObject, useEffect, useRef, useState } from "react";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { BaseRuntime } from "../baseRuntime";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsFullscreen } from "@/redux/controls";

const useControls = (
  baseRuntimeRef: MutableRefObject<BaseRuntime | null>,
  canvasRef: MutableRefObject<HTMLCanvasElement>
): void => {
  const isFullscreen = useSelector((state: RootState) => state.controls.isFullscreen);
  const originalCanvasSize = useRef<{ width: number; height: number }>({
    width: canvasRef.current.width,
    height: canvasRef.current.height,
  });
  const dispatch = useDispatch();

  document.addEventListener("fullscreenchange", onFullScreenChange);

  function onFullScreenChange(): void {
    dispatch(setIsFullscreen(!!document.fullscreenElement));
  }

  useEffect(() => {
    setFullscreen(isFullscreen);
  }, [isFullscreen]);


  function setFullscreen(isFullscreen: boolean): void {
    if (isFullscreen) {
      originalCanvasSize.current.width = canvasRef.current.width;
      originalCanvasSize.current.height = canvasRef.current.height;
      console.log("Entering fullscreen");
      console.log(originalCanvasSize.current.width, originalCanvasSize.current.height);
      baseRuntimeRef.current!.engine.enterFullscreen(false);
    } else {
      console.log("Exiting fullscreen");
      console.log("Current:", canvasRef.current.width, canvasRef.current.height);
      console.log("Original:", originalCanvasSize.current.width, originalCanvasSize.current.height);

      baseRuntimeRef.current!.engine.exitFullscreen();

      // Restore original canvas size
      canvasRef.current.width = originalCanvasSize.current.width;
      canvasRef.current.height = originalCanvasSize.current.height;

      console.log("Restored:", canvasRef.current.width, canvasRef.current.height);
    }
  }
};

export default useControls;
