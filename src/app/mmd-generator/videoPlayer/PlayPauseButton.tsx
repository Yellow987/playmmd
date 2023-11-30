"use client";
import { useState, useEffect } from "react";
import { getMmdRuntime } from "../babylon/mmdComponents/mmdRuntime";
import { Button } from "@chakra-ui/react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Observer } from "@babylonjs/core/Misc/observable";

function PlayPauseButton() {
  return (
    <Button size="sm" mr={4}>
      {true ? <FaPause /> : <FaPlay />}
    </Button>
  );
}

export default PlayPauseButton;
