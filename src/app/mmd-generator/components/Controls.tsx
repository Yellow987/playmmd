"use client";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createArcCamera } from "../babylon/util";
import { BaseRuntime } from "../babylon/baseRuntime";

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
}

function Controls(props: Props) {
  const { runtimeRef } = props;
  const [doSomething, setDoSomething] = useState(false);

  useEffect(() => {
    if (runtimeRef?.current && doSomething) {
      const scene = runtimeRef.current._scene;
      const arcRotateCamera = createArcCamera(
        scene,
        runtimeRef.current._canvas,
      );
      scene.activeCamera = arcRotateCamera;
    }
  }, [doSomething]);

  return (
    <Button onClick={() => setDoSomething(!doSomething)}>
      Do something {doSomething ? "true" : "false"}
    </Button>
  );
}

export default Controls;
