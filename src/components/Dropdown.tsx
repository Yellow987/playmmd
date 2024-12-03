"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  menuLabel: string;
  onMenuItemSelect: (item: any) => void;
  menuItems: { [key: string]: { name: string } };
  defaultItem: string;
  uploadButton?: React.ReactElement;
}

function Dropdown(props: Props) {
  const [selectedItem, setSelectedItem] = useState(props.defaultItem);
  const menuOptions = Object.entries(props.menuItems);

  const onDropdownMenuItemSelect = (key: string) => {
    setSelectedItem(key);
    props.onMenuItemSelect(key);
  };

  return (
    <Box mb={4}>
      <Box as="label" display="block" mb={1}>
        {props.menuLabel}
      </Box>
      <Menu>
        <MenuButton as={Button} w="full" rightIcon={<ChevronDownIcon />}>
          {props.menuItems[selectedItem].name}
        </MenuButton>
        <MenuList>
          {menuOptions.map(([key, value]) => (
            <MenuItem key={key} onClick={() => onDropdownMenuItemSelect(key)}>
              {value.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default Dropdown;
