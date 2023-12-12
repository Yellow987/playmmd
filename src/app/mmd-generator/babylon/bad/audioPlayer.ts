import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { getScene } from "./scene";

let audioPlayer: StreamAudioPlayer | null = null

export function createAudioPlayer(audioPath: string): StreamAudioPlayer {
  const scene = getScene();
  audioPlayer = new StreamAudioPlayer(scene);
  audioPlayer.source = audioPath;
  return audioPlayer;
}

export function getAudioPlayer(): StreamAudioPlayer {
  if (audioPlayer === null) {
    throw new Error("Audio player not initialized");
  }
  return audioPlayer
}