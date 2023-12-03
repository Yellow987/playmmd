"use client";
import { BaseRuntime } from "../babylon/baseRuntime";
import Dropdown from "@/components/Dropdown";
import { useDispatch } from "react-redux";
import { setActiveCamera } from "@/app/redux/cameras";
import { setDepthOfFieldEnabled } from "@/app/redux/controls";

interface Props {
  runtimeRef: React.MutableRefObject<BaseRuntime | null>;
}

function Controls(props: Props) {
  const dispatch = useDispatch();

  enum CameraControl {
    MMD_CAMERA = "MMD Camera",
    USER_CONTROL_CAMERA = "USER_CONTROL_CAMERA",
  }

  const cameraControlMenuItems = {
    [CameraControl.MMD_CAMERA]: {
      name: "MMD Camera",
      function: () => {
        dispatch(setActiveCamera("mmdCamera"));
      },
    },
    [CameraControl.USER_CONTROL_CAMERA]: {
      name: "Free Camera",
      function: () => {
        dispatch(setActiveCamera("arcCamera"));
        dispatch(setDepthOfFieldEnabled(false));
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
