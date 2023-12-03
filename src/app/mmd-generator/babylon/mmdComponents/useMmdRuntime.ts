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

const useMmdRuntime = (
  sceneRef: MutableRefObject<Scene>,
): MutableRefObject<MmdRuntime> => {
  const mmdRuntimeRef = useRef<MmdRuntime>(createMmdRuntime(sceneRef.current));
  const dispatch = useDispatch();

  useEffect(() => {
    mmdRuntimeRef.current.register(sceneRef.current);

    const onAnimationDurationChangedObserver: Observer<void> | undefined =
      mmdRuntimeRef.current.onAnimationDurationChangedObservable.add(() => {
        const newDuration = mmdRuntimeRef.current.animationDuration;
        dispatch(setAnimationDuration(newDuration));
      });

    return () => {
      mmdRuntimeRef.current.onAnimationDurationChangedObservable.remove(
        onAnimationDurationChangedObserver,
      );
    };
  }, []);

  function createMmdRuntime(scene: Scene): MmdRuntime {
    const newMmdRuntime = new MmdRuntime(new MmdPhysics(scene));
    newMmdRuntime.register(scene);
    return newMmdRuntime;
  }

  return mmdRuntimeRef;
};

export default useMmdRuntime;
