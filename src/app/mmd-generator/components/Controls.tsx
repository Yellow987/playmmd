"use client";
import Dropdown from "@/components/Dropdown";
import { setActiveCamera } from "@/redux/cameras";
import { setIsDepthOfFieldEnabled } from "@/redux/controls";
import { RootState } from "@/redux/store";
import { SimpleGrid, Box, VStack, Checkbox } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

function Controls() {
  const dispatch = useDispatch();
  const isDepthOfFieldEnabled = useSelector((state: RootState) => state.controls.isDepthOfFieldEnabled);

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
        dispatch(setIsDepthOfFieldEnabled(false));
      },
    },
  };

  function onCameraControlSelect(key: string) {
    const item =
      cameraControlMenuItems[key as keyof typeof cameraControlMenuItems];
    item.function();
  }

  return (
    <>
    <SimpleGrid
      columns={{ base: 1, md: 2 }} // 1 column on small screens, 2 columns on medium and larger screens
      spacing="4" // Space between items
    >
      <Dropdown
        menuLabel="Camera Control"
        onMenuItemSelect={onCameraControlSelect}
        menuItems={cameraControlMenuItems}
        defaultItem="MMD Camera"
      />
      <VStack spacing={4} align="stretch">
        <Checkbox
          isChecked={isDepthOfFieldEnabled}
          onChange={(e) => dispatch(setIsDepthOfFieldEnabled(e.target.checked))}
        >
          Depth of Field {process.env.STAGE}
        </Checkbox>
      </VStack>
    </SimpleGrid>
    </>
  );
}

export default Controls;
