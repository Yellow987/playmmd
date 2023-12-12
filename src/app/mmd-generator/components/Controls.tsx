"use client";
import { BaseRuntime } from "../babylon/baseRuntime";
import Dropdown from "@/components/Dropdown";
import { enableArcCamera, enableMmdCamera } from "../babylon/bad/cameras";

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
}

function Controls(props: Props) {
  const { runtimeRef } = props;

  enum CameraControl {
    MMD_CAMERA = "MMD Camera",
    USER_CONTROL_CAMERA = "USER_CONTROL_CAMERA",
  }

  const cameraControlMenuItems = {
    [CameraControl.MMD_CAMERA]: {
      name: "MMD Camera",
      function: () => {
        enableMmdCamera();
      },
    },
    [CameraControl.USER_CONTROL_CAMERA]: {
      name: "Free Camera",
      function: () => {
        enableArcCamera();
      },
    },
  };

  function onCameraControlSelect(item: any) {
    item.function();
  }

  return (
    <>
      <Dropdown
        menuLabel="Camera Control"
        onMenuItemSelect={onCameraControlSelect}
        menuItems={cameraControlMenuItems}
        defaultItem="MMD Camera"
      />
    </>
  );
}

export default Controls;
