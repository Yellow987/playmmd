import { Engine, HavokPlugin, Color3, HemisphericLight } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { useRef } from "react";
import { singletonHook } from "react-singleton-hook";

let globalInitScene = async (scene: Scene): Promise<void> => {
  throw new Error("useScene not initialized yet.");
};
let globalGetScene = (): Scene => {
  throw new Error("useScene not initialized yet.");
};

const useSceneImpl = (): void => {
  const sceneRef = useRef<Scene>();

  globalInitScene = async (scene: Scene) => {
    console.log(sceneRef.current);
    if (sceneRef.current) {
      return;
    }
    sceneRef.current = scene;
    console.log("Scene set!");
    sceneRef.current.enablePhysics(
      new Vector3(0, -9.8 * 10, 0),
      new HavokPlugin(true, await HavokPhysics()),
    );
  };

  globalGetScene = () => {
    if (!sceneRef.current) {
      throw new Error(
        "Scene has not been created yet. Call createScene first.",
      );
    }
    return sceneRef.current;
  };
  console.log("useSceneImpl");
};

export const useScene = singletonHook(null, useSceneImpl);
export const getScene = (): Scene => globalGetScene();
export const initScene = async (scene: Scene): Promise<void> =>
  await globalInitScene(scene);
