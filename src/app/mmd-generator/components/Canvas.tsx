"use client";

import { Engine } from "@babylonjs/core";
import { useEffect, useRef, useState } from "react";
import { BaseRuntime } from "../babylon/baseRuntime";
import { SceneBuilder } from "../babylon/sceneBuilder";
import { cleanupAllModels } from "../babylon/mmdComponents/mmdModels";
import { cleanupScene } from "../babylon/mmdComponents/scene";
import { cleanupMmdRuntime } from "../babylon/mmdComponents/mmdRuntime";

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

function Canvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isInitialized = useRef(false);
  const initializationStarted = useRef(false);
  const { runtimeRef, setIsLoaded } = props;

  useEffect(() => {
    const initializeRuntime = async () => {
      if (
        canvasRef.current &&
        !isInitialized.current &&
        !initializationStarted.current
      ) {
        initializationStarted.current = true;
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

        const runtime = await BaseRuntime.Create({
          canvas,
          engine,
          sceneBuilder: new SceneBuilder(),
        });

        runtime.run();
        runtimeRef.current = runtime;
        setIsLoaded(true);
        isInitialized.current = true;

        return () => {
          if (isInitialized.current) {
            console.log("CLEANUP CANVAS");
            cleanupAllModels();
            cleanupScene();
            cleanupMmdRuntime();
            engine.dispose();
          }
        };
      }
    };

    initializeRuntime();

    return () => {
      if (initializationStarted && !isInitialized.current) {
        console.log("Attempted cleanup without initialization complete.");
      }
    };
  }, [runtimeRef, setIsLoaded]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default Canvas;
