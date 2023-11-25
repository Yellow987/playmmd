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

function Presets() {
  const [selectedCharacter, setSelectedCharacter] = useState(
    "Select Character Model"
  );
  const [selectedStage, setSelectedStage] = useState("Select Stage");
  const [selectedAnimation, setSelectedAnimation] =
    useState("Select Animation");

  return (
    <>
      <Box mb={2}>
        <Box as="label" display="block" mb={1}>
          Character Model
        </Box>
        <Menu>
          <MenuButton as={Button} w="full" rightIcon={<ChevronDownIcon />}>
            {selectedCharacter}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSelectedCharacter("Hatsune Miku YYB")}>
              Hatsune Miku YYB
            </MenuItem>
            <MenuItem onClick={() => setSelectedCharacter("Cyborg")}>
              Cyborg
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Box mb={2}>
        <Box as="label" display="block" mb={1}>
          Stage
        </Box>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="full">
            {selectedStage}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSelectedStage("Basic")}>Basic</MenuItem>
            <MenuItem onClick={() => setSelectedStage("Castle")}>
              Castle
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Box>
        <Box as="label" display="block" mb={1}>
          Animation
        </Box>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="full">
            {selectedAnimation}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSelectedAnimation("Last Christmas")}>
              Last Christmas
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </>
  );
}

export default Presets;
