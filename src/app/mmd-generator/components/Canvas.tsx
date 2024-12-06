"use client";

import { Engine, Scene } from "@babylonjs/core";
import { useEffect, useRef, useState } from "react";
import { BaseRuntime } from "../babylon/baseRuntime";
import { SceneBuilder } from "../babylon/sceneBuilder";
import { cleanupScene } from "../babylon/mmdHooks/scene";

interface Props {
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
  sceneRef: React.MutableRefObject<Scene | null>;
}

function Canvas(props: Props) {
  const isInitialized = useRef(false);
  const initializationStarted = useRef(false);
  const { canvasRef, sceneRef, runtimeRef, setIsLoaded } = props;

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

        // runtime.run();
        canvasRef.current = runtime.canvas;
        sceneRef.current = runtime.scene;
        runtimeRef.current = runtime;
        setIsLoaded(true);
        isInitialized.current = true;

        return () => {
          if (isInitialized.current) {
            console.log("CLEANUP CANVAS");
            // cleanupAllModels();
            cleanupScene();
            // cleanupMmdRuntime();
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
  }, [setIsLoaded]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default Canvas;
