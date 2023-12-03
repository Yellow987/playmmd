import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const useAudioPlayer = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntime: MmdRuntime,
): void => {
  const audioPath = useSelector((state: RootState) => state.audio.audioPath);
  const volume = useSelector((state: RootState) => state.controls.volume);
  const isMuted = useSelector((state: RootState) => state.controls.isMuted);
  const audioPlayerRef = useRef<StreamAudioPlayer>(
    new StreamAudioPlayer(sceneRef.current),
  );
  mmdRuntime.setAudioPlayer(audioPlayerRef.current);

  useEffect(() => {
    audioPlayerRef.current.source = audioPath;
  }, [audioPath]);

  useEffect(() => {
    audioPlayerRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isMuted) {
      audioPlayerRef.current.mute();
    } else {
      audioPlayerRef.current.unmute();
    }
  }, [isMuted]);

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
