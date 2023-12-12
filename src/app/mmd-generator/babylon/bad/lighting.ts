import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { MutableRefObject, useRef, useState } from "react";
import { singletonHook } from "react-singleton-hook";

const initLights = {
  current: [],
};

const useLightsImpl = (): MutableRefObject<DirectionalLight[]> => {
  const mmdLights = useRef<DirectionalLight[]>([]);
  mmdLights.current.push(createDirectionalLight(getScene()));
  return mmdLights;
};

const createDirectionalLight = (scene: Scene): DirectionalLight => {
  const directionalLight = new DirectionalLight(
    "DirectionalLight",
    new Vector3(0.5, -1, 1),
    scene,
  );
  directionalLight.intensity = 0.7;
  directionalLight.shadowMaxZ = 20;
  directionalLight.shadowMinZ = -15;
  return directionalLight;
};

export const useLights = singletonHook(initLights, useLightsImpl);
