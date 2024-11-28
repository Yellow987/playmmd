"use client";
import { useState, useEffect } from "react";
import { getMmdRuntime } from "../../babylon/mmdHooks/mmdRuntime";
import { Button } from "@chakra-ui/react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Observer } from "@babylonjs/core/Misc/observable";

function PlayPauseButton() {
  const mmdRuntime = getMmdRuntime();
  const [isPlaying, setIsPlaying] = useState(mmdRuntime.isAnimationPlaying);

  useEffect(() => {
    const onPlayAnimationObserver: Observer<void> =
      mmdRuntime.onPlayAnimationObservable.add(() => {
        setIsPlaying(true);
      });

    const onPauseAnimationObserver: Observer<void> =
      mmdRuntime.onPauseAnimationObservable.add(() => {
        setIsPlaying(false);
      });

    return () => {
      mmdRuntime.onPlayAnimationObservable.remove(onPlayAnimationObserver);
      mmdRuntime.onPauseAnimationObservable.remove(onPauseAnimationObserver);
    };
  }, []);

  return (
    <Button
      onClick={() =>
        mmdRuntime.isAnimationPlaying
          ? mmdRuntime.pauseAnimation()
          : mmdRuntime.playAnimation()
      }
      size="sm"
      mr={4}
    >
      {isPlaying ? <FaPause /> : <FaPlay />}
    </Button>
  );
}

export default PlayPauseButton;
