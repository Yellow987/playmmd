"use client";
import { useState, useEffect, MutableRefObject, useRef } from "react";
import useMmdModels from "./useMmdModels";
import useMmdMotions from "./useMmdMotions";
import usePostProcessor from "./usePostProcessor";
import useCameras from "./useCameras";
import useLighting from "./useLighting";
import useStage from "./useStage";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { Scene } from "@babylonjs/core/scene";
import useAudioPlayer from "./useAudioPlayer";
import { BaseRuntime } from "../baseRuntime";
import { createMmdRuntime } from "./mmdRuntime";
import { Observer } from "@babylonjs/core/Misc/observable";
import { setAnimationDuration, setIsPlaying, setSecond } from "@/redux/mmd";
import { useDispatch } from "react-redux";

interface Props {
  sceneRef: MutableRefObject<Scene>;
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  baseRuntimeRef: MutableRefObject<BaseRuntime | null>;
}

const UseMmd = (props: Props) => {
  const { sceneRef, canvasRef, baseRuntimeRef } = props;
  if (!sceneRef.current || !canvasRef.current) {
    throw new Error("Scene or canvas is null");
  }
  const dispatch = useDispatch();

  const mmdRuntime = createMmdRuntime(sceneRef.current);
  useCameras(sceneRef, mmdRuntime, canvasRef);
  baseRuntimeRef.current!.run();
  useLighting(sceneRef);
  useStage(sceneRef);
  useAudioPlayer(sceneRef, mmdRuntime);
  const mmdCharacterModelsRef = useMmdModels(sceneRef, mmdRuntime);
  useMmdMotions(sceneRef, mmdCharacterModelsRef);
  usePostProcessor(sceneRef, mmdCharacterModelsRef);

  useEffect(() => {
    mmdRuntime.playAnimation();
  }, []);

  useEffect(() => {
    const onAnimationDurationChangedObserver: Observer<void> | undefined =
      mmdRuntime.onAnimationDurationChangedObservable.add(() => {
        const newDuration = mmdRuntime!.animationDuration;
        dispatch(setAnimationDuration(newDuration));
      });

    const onTickObserver: Observer<void> | undefined =
      mmdRuntime.onAnimationTickObservable.add(() => {
        dispatch(setSecond(mmdRuntime.currentTime));
      });

    const onPlayAnimationObserver: Observer<void> =
      mmdRuntime.onPlayAnimationObservable.add(() => {
        dispatch(setIsPlaying(true));
      });

    const onPauseAnimationObserver: Observer<void> =
      mmdRuntime.onPauseAnimationObservable.add(() => {
        dispatch(setIsPlaying(false));
      });

    return () => {
      mmdRuntime!.onAnimationDurationChangedObservable.remove(
        onAnimationDurationChangedObserver,
      );
      mmdRuntime.onAnimationTickObservable.remove(onTickObserver);
      mmdRuntime.onPlayAnimationObservable.remove(onPlayAnimationObserver);
      mmdRuntime.onPauseAnimationObservable.remove(onPauseAnimationObserver);
    };
  }, []);

  return <></>;
};

export default UseMmd;
