"use client";

import { Engine } from "@babylonjs/core";
import { useEffect, useRef } from "react";
import { BaseRuntime } from "./baseRuntime";
import { SceneBuilder } from "./sceneBuilder";
import { Scene } from "@babylonjs/core/scene";

interface Props {
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  sceneRef: React.MutableRefObject<Scene | null>;
}

function Canvas(props: Props) {
  const babylonCanvasRef = useRef(null);
  const { canvasRef, sceneRef, setIsLoaded } = props;

  useEffect(() => {
    // Ensure the canvas is available
    if (babylonCanvasRef.current) {
      console.log("RENDERED CANVAS");
      const canvas = babylonCanvasRef.current;
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
        canvasRef.current = runtime.canvas;
        sceneRef.current = runtime.scene;
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
      <canvas
        ref={babylonCanvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default Canvas;
