import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const useAudioPlayer = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntimeRef: MutableRefObject<MmdRuntime>,
): void => {
  const audioPath = useSelector((state: RootState) => state.audio.audioPath);
  const volume = useSelector((state: RootState) => state.controls.volume);
  const audioPlayerRef = useRef<StreamAudioPlayer>(
    new StreamAudioPlayer(sceneRef.current),
  );
  mmdRuntimeRef.current.setAudioPlayer(audioPlayerRef.current);

  useEffect(() => {
    audioPlayerRef.current.source = audioPath;
  }, [audioPath]);

  useEffect(() => {
    audioPlayerRef.current.volume = volume;
  }, [volume]);

  function createAudioPlayer(
    scene: Scene,
    audioUrl: string,
  ): StreamAudioPlayer {
    const audioPlayer = new StreamAudioPlayer(scene);
    audioPlayer.source = audioUrl;
    audioPlayer.volume = volume;
    return audioPlayer;
  }
};

export default useAudioPlayer;
