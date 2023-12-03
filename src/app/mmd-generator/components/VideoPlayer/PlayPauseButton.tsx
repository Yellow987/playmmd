"use client";
import { useState, useEffect } from "react";
import { getMmdRuntime } from "../../babylon/mmdComponents/mmdRuntime";
import { Button, Icon } from "@chakra-ui/react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Observer } from "@babylonjs/core/Misc/observable";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

function PlayPauseButton() {
  const isPlaying = useSelector((state: RootState) => state.mmd.isPlaying);

  return (
    <>
      {/* <Button size="xs">
        <Icon as={FaPlay} transform="scaleX(-1)" />
      </Button> */}
      <Button
        onClick={() =>
          getMmdRuntime().isAnimationPlaying
            ? getMmdRuntime().pauseAnimation()
            : getMmdRuntime().playAnimation()
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
