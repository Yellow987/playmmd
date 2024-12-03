"use client";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MutableRefObject, useState } from "react";
import Dropdown from "@/components/Dropdown";
import {
  AnimationPreset,
  AnimationPresetData,
  CharacterModel,
  CharacterModelData,
  ANIMATION_PRESETS_DATA,
  CHARACTER_MODELS_DATA,
} from "../constants";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setModels } from "@/redux/mmdModels";
import MmdModelUpload from "./MmdAssetChooserModal";
import MmdAssetChooserModal from "./MmdAssetChooserModal";
import { localAssets } from "../MmdViewer";

interface Props {
  localFilesRef: MutableRefObject<localAssets[]>;
}

const Presets = (props: Props) => {
  const { localFilesRef } = props;
  const [selectedStage, setSelectedStage] = useState("Select Stage");
  const dispatch = useDispatch();
  const characterModels = useSelector(
    (state: RootState) => state.mmdModels.models,
  );

  // const onCharacterSelect = (model: CharacterModel) => {
  //   const newCharacterModels = [...characterModels];
  //   newCharacterModels[0] = model;
  //   dispatch(setModels(newCharacterModels));
  // };

  const onAnimationSelect = (animation: AnimationPreset) => {
    console.log(animation);
  };

  return (
    <>
      <Box mb={4}>
        <Box as="label" display="block" mb={1}>
          Character Model
        </Box>
        <MmdAssetChooserModal localFilesRef={localFilesRef} />
      </Box>

      {/* 
      <Dropdown
        menuLabel="Character Model"
        onMenuItemSelect={onCharacterSelect}
        menuItems={CHARACTER_MODELS_DATA}
        defaultItem={CharacterModel.HATSUNE_MIKU_YYB_10TH}
      /> */}

      <Box mb={2}>
        <Box as="label" display="block" mb={1}>
          Stage
        </Box>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="full">
            {selectedStage}
          </MenuButton>
          <MenuList></MenuList>
        </Menu>
      </Box>

      <Dropdown
        menuLabel="Animation Name"
        onMenuItemSelect={onAnimationSelect}
        menuItems={ANIMATION_PRESETS_DATA}
        defaultItem={AnimationPreset.LAST_CHRISTMAS}
      />
    </>
  );
};

export default Presets;
