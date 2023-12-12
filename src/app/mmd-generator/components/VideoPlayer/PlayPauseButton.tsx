"use client";
import { useState, useEffect } from "react";
import { getMmdRuntime } from "../../babylon/bad/mmdRuntime";
import { Button, Icon } from "@chakra-ui/react";
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
    <>
      {/* <Button size="xs">
        <Icon as={FaPlay} transform="scaleX(-1)" />
      </Button> */}
      <Button
        onClick={() =>
          mmdRuntime.isAnimationPlaying
            ? mmdRuntime.pauseAnimation()
            : mmdRuntime.playAnimation()
        }
        size="sm"
        mx={2}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </Button>
      {/* <Button size="xs">
        <FaPlay />
      </Button> */}
    </>
  );
}

export default PlayPauseButton;
