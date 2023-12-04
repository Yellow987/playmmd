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
import { useState } from "react";
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
import { setMmdModels } from "@/app/redux/mmdModels";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

function Presets() {
  const [selectedStage, setSelectedStage] = useState("Select Stage");
  const dispatch = useDispatch();
  const characterModels = useSelector(
    (state: RootState) => state.mmdModels.characterModels,
  );

  const onCharacterSelect = (model: CharacterModel) => {
    const newCharacterModels = [...characterModels];
    newCharacterModels[0] = model;
    dispatch(setMmdModels(newCharacterModels));
  };

  const onAnimationSelect = (item: AnimationPresetData) => {
    console.log(item);
  };

  return (
    <>
      <Dropdown
        menuLabel="Character Model"
        onMenuItemSelect={onCharacterSelect}
        menuItems={CHARACTER_MODELS_DATA}
        defaultItem={CharacterModel.HATSUNE_MIKU_YYB_10TH}
      />

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
}

export default Presets;
