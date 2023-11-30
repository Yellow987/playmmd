"use client";

import { Engine } from "@babylonjs/core";
import { useEffect, useRef } from "react";
import { BaseRuntime } from "../babylon/baseRuntime";
import { SceneBuilder } from "../babylon/sceneBuilder";

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Canvas(props: Props) {
  const canvasRef = useRef(null);
  const { runtimeRef, setIsLoaded } = props;

  useEffect(() => {
    // Ensure the canvas is available
    if (canvasRef.current) {
      console.log("RENDERED CANVAS");
      const canvas = canvasRef.current;
      const engine = new Engine(
        canvas,
        false,
        {
          preserveDrawingBuffer: false,
          stencil: false,
          antialias: false,
          alpha: false,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
          doNotHandleTouchAction: true,
          doNotHandleContextLost: true,
          audioEngine: false,
        },
        true,
      );

      BaseRuntime.Create({
        canvas,
        engine,
        sceneBuilder: new SceneBuilder(),
      }).then((runtime) => {
        runtime.run();
        runtimeRef.current = runtime;
        setIsLoaded(true);
      });

      // Correctly typed resize handler for TypeScript
      const handleResize = () => {
        engine.resize();
      };

      window.addEventListener("resize", handleResize);

      // Clean up the engine on unmount
      return () => {
        engine.dispose();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default Canvas;
