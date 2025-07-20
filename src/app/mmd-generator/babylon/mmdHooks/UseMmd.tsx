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
import useControls from "./useControls";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { localAssets, MmdViewerMode } from "../../MmdViewer";

interface Props {
  sceneRef: MutableRefObject<Scene>;
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  runtimeRef: MutableRefObject<BaseRuntime | null>;
  localFilesRef: MutableRefObject<localAssets[]>;
  mmdCharacterModelsRef: MutableRefObject<MmdModel[]>;
  mode?: MmdViewerMode;
}

const UseMmd = (props: Props) => {
  const {
    sceneRef,
    canvasRef,
    runtimeRef: runtimeRef,
    localFilesRef,
    mmdCharacterModelsRef,
    mode = "editor",
  } = props;
  if (!sceneRef.current || !canvasRef.current) {
    throw new Error("Scene or canvas is null");
  }
  const dispatch = useDispatch();

  const mmdRuntime = createMmdRuntime(sceneRef.current);
  useCameras(sceneRef, mmdRuntime, canvasRef, mode);
  runtimeRef.current!.run();
  useLighting(sceneRef);
  useStage(sceneRef);
  useAudioPlayer(sceneRef, mmdRuntime);
  useMmdModels(
    sceneRef,
    mmdRuntime,
    localFilesRef,
    mmdCharacterModelsRef,
    runtimeRef,
  );
  useMmdMotions(sceneRef, mmdCharacterModelsRef, mode);
  usePostProcessor(sceneRef, mmdCharacterModelsRef);
  useControls(runtimeRef, canvasRef);

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
