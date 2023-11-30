import React, { useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  useBeforeRender,
  useEngine,
  useScene,
} from "react-babylonjs";
import {
  Vector3,
  Color3,
  Scene as BabylonScene,
  ArcRotateCamera,
  DirectionalLight,
  SceneLoader,
  Mesh,
} from "@babylonjs/core";
import { MeshBuilder } from "@babylonjs/core";
import { createMmdRuntime, getMmdRuntime } from "./mmdComponents/mmdRuntime";
import { createShadowGenerator } from "./mmdComponents/shadowGenerator";
import {
  ANIMATION_PRESETS_DATA,
  ModelAniamtionPaths,
  CHARACTER_MODELS_DATA,
  defaultCharacterModel,
  AnimationPreset,
} from "../constants";
import { addMmdMotion, createAndSetMmdModel } from "./mmdComponents/mmdModels";
// for cast shadow, we need to import following module.
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "babylon-mmd/esm/Loader/pmxLoader";
// for play `MmdAnimation` we need to import following two modules.
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeCameraAnimation";
import "babylon-mmd/esm/Runtime/Animation/mmdRuntimeModelAnimation";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

interface Props {
  setValue: (value: number) => void;
}

const MyGround = (props: Props) => {
  const scene = useScene() as BabylonScene;
  const [mmdMesh, setMmdMesh] = useState<Mesh | null>(null);
  const testRef = useRef(false);

  useEffect(() => {
    const loadMesh = async () => {
      scene.enablePhysics(
        new Vector3(0, -9.8 * 10, 0),
        new HavokPlugin(true, await HavokPhysics()),
      );
      const directionalLight = new DirectionalLight(
        "DirectionalLight",
        new Vector3(0.5, -1, 1),
        scene,
      );
      directionalLight.intensity = 0.7;
      directionalLight.shadowMaxZ = 20;
      directionalLight.shadowMinZ = -15;
      const arcCamera = scene.activeCamera as ArcRotateCamera;

      const mmdRuntime = createMmdRuntime(scene);
      const shadowGenerator = createShadowGenerator(
        directionalLight,
        arcCamera,
      );
      const modelData = CHARACTER_MODELS_DATA[defaultCharacterModel];
      await createAndSetMmdModel(0, modelData, scene);
      const animationPaths: ModelAniamtionPaths =
        ANIMATION_PRESETS_DATA[AnimationPreset.LAST_CHRISTMAS]
          .modelAnimationPaths[0];
      await addMmdMotion(0, animationPaths, scene);
      mmdRuntime.playAnimation();
      testRef.current = true;
    };

    loadMesh();
  }, [scene]); // Add any other dependencies if necessary

  useBeforeRender((scene) => {
    if (testRef.current) {
      const mmdRuntime = getMmdRuntime();
      props.setValue(
        (mmdRuntime.currentTime / mmdRuntime.animationDuration) * 100,
      );
    }
  });

  if (!mmdMesh) {
    return <></>;
  }

  // Once the mesh is loaded, return your JSX
  return <>{/* Your JSX here, possibly involving mmdMesh */}</>;
};

function Canvas() {
  const [value, setValue] = useState(0);

  return (
    <>
      <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
        <Scene>
          <arcRotateCamera
            name="camera1"
            target={Vector3.Zero()}
            alpha={Math.PI / 2}
            beta={Math.PI / 4}
            radius={8}
          />
          <directionalLight
            name="light1"
            intensity={0.7}
            direction={Vector3.Up()}
          />
          <ground name="ground1" width={10} height={6} subdivisions={2} />
          <MyGround setValue={setValue} />
        </Scene>
      </Engine>
      hi
      <Slider value={value} focusThumbOnChange={false}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </>
  );
}

export default Canvas;
