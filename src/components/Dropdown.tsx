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
  menuLabel?: string;
  onMenuItemSelect: (item: any) => void;
  menuItems: { [key: string]: { name: string } };
  defaultItem: string;
  isInitializing: boolean;
}

function Dropdown(props: Props) {
  const [selectedItem, setSelectedItem] = useState(
    props.menuItems[props.defaultItem],
  );
  const menuOptions = Object.values(props.menuItems);

  const onDropdownMenuItemSelect = (item: any) => {
    setSelectedItem(item);
    props.onMenuItemSelect(item);
  };

  return (
    <Box mb={4}>
      {props.menuLabel && (
        <Box as="label" display="block" mb={1}>
          {props.menuLabel}
        </Box>
      )}
      <Menu>
        <MenuButton
          as={Button}
          w="full"
          rightIcon={<ChevronDownIcon />}
          isDisabled={props.isInitializing}
        >
          {selectedItem.name}
        </MenuButton>
        <MenuList>
          {menuOptions.map((item) => (
            <MenuItem
              key={item.name}
              onClick={() => onDropdownMenuItemSelect(item)}
            >
              {item.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default Dropdown;
