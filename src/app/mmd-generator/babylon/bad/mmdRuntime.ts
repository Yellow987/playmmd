import { Scene } from "@babylonjs/core";
import { MmdPhysics } from "babylon-mmd/esm/Runtime/mmdPhysics";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useRef } from "react";
import { singletonHook } from "react-singleton-hook";

let globalInitMmdRuntime = (scene: Scene): void => {
  throw new Error("useMmdRuntime not initialized yet.");
};
let globalGetMmdRuntime = (): MmdRuntime => {
  throw new Error("useMmdRuntime not initialized yet.");
};

function useMmdRuntimeImpl(): void {
  const mmdRuntimeRef = useRef<MmdRuntime>();

  globalInitMmdRuntime = (scene: Scene) => {
    mmdRuntimeRef.current = new MmdRuntime(new MmdPhysics(scene));
    mmdRuntimeRef.current.register(scene);
  };

  globalGetMmdRuntime = () => {
    if (!mmdRuntimeRef.current) {
      throw new Error(
        "MmdRuntime has not been created yet. Call createMmdRuntime first.",
      );
    }
    return mmdRuntimeRef.current;
  };
}
export const useMmdRuntime = singletonHook(null, useMmdRuntimeImpl);
export const initMmdRuntime = (scene: Scene): void =>
  globalInitMmdRuntime(scene);
export const getMmdRuntime = (): MmdRuntime => globalGetMmdRuntime();
