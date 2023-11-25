import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { getScene } from "./scene";

export function createAudioPlayer(audioPath: string): StreamAudioPlayer {
  const scene = getScene();
  const audioPlayer = new StreamAudioPlayer(scene);
  audioPlayer.source = audioPath;
  return audioPlayer;
}
