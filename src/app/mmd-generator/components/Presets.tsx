"use client";
import {
  Button,
  Box,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList } from '@chakra-ui/menu';
import { MdKeyboardArrowDown } from "react-icons/md";
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

function Presets() {
  const [selectedStage, setSelectedStage] = useState("Select Stage");

  const onCharacterSelect = (item: CharacterModelData) => {
    console.log(item);
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
          <MenuButton as={Button} w="full">
            {selectedStage} <MdKeyboardArrowDown />
          </MenuButton>
          <MenuList></MenuList>
        </Menu>
      </Box>

      <Dropdown
        menuLabel="Animation Name"
        onMenuItemSelect={onAnimationSelect}
        menuItems={ANIMATION_PRESETS_DATA}
        defaultItem={AnimationPreset.FIGHTING_MY_WAY}
      />
    </>
  );
}

export default Presets;
