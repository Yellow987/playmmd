import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { MmdPhysics } from "babylon-mmd/esm/Runtime/mmdPhysics";
import { Observer } from "@babylonjs/core/Misc/observable";
import { setAnimationDuration } from "@/app/redux/mmd";

const useMmdRuntime = (sceneRef: MutableRefObject<Scene>): MmdRuntime => {
  const dispatch = useDispatch();
  let mmdRuntime: MmdRuntime | null = null;

  useEffect(() => {
    mmdRuntime = createMmdRuntime(sceneRef.current);

    const onAnimationDurationChangedObserver: Observer<void> | undefined =
      mmdRuntime.onAnimationDurationChangedObservable.add(() => {
        const newDuration = mmdRuntime!.animationDuration;
        dispatch(setAnimationDuration(newDuration));
      });

    return () => {
      mmdRuntime!.onAnimationDurationChangedObservable.remove(
        onAnimationDurationChangedObserver,
      );
    };
  }, []);

  function createMmdRuntime(scene: Scene): MmdRuntime {
    const newMmdRuntime = new MmdRuntime(new MmdPhysics(scene));
    newMmdRuntime.register(scene);
    return newMmdRuntime;
  }

  return mmdRuntime;
};

export default useMmdRuntime;
