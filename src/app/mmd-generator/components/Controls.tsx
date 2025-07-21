"use client";
import Dropdown from "@/components/Dropdown";
import { ActiveCamera, setActiveCamera } from "@/redux/cameras";
import { setIsDepthOfFieldEnabled } from "@/redux/controls";
import { RootState } from "@/redux/store";
import { SimpleGrid, Box, VStack, Checkbox } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

function Controls() {
  const dispatch = useDispatch();
  const isDepthOfFieldEnabled = useSelector(
    (state: RootState) => state.controls.isDepthOfFieldEnabled,
  );

  const cameraControlMenuItems: Record<
    ActiveCamera,
    {
      name: string;
      function: () => void;
    }
  > = {
    ["mmdCamera"]: {
      name: "MMD Camera",
      function: () => {
        dispatch(setActiveCamera(ActiveCamera.MMD_CAMERA));
      },
    },
    ["arcCamera"]: {
      name: "Arc Camera",
      function: () => {
        dispatch(setActiveCamera(ActiveCamera.ARC_CAMERA));
        dispatch(setIsDepthOfFieldEnabled(false));
      },
    },
    ["freeCamera"]: {
      name: "Free Camera",
      function: () => {
        dispatch(setActiveCamera(ActiveCamera.FREE_CAMERA));
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
          defaultItem={ActiveCamera.MMD_CAMERA}
        />
        <VStack spacing={4} align="stretch">
          <Checkbox
            isChecked={isDepthOfFieldEnabled}
            onChange={(e) =>
              dispatch(setIsDepthOfFieldEnabled(e.target.checked))
            }
          >
            Depth of Field
          </Checkbox>
        </VStack>
      </SimpleGrid>
    </>
  );
}

export default Controls;
