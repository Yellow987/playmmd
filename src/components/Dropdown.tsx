"use client";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  Button,
  Box,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu';
import { useEffect, useState } from "react";

interface Props {
  menuLabel: string;
  onMenuItemSelect: (item: any) => void;
  menuItems: { [key: string]: { name: string } };
  defaultItem: string;
}

function Dropdown(props: Props) {
  const [selectedItem, setSelectedItem] = useState(
    props.menuItems[props.defaultItem],
  );
  const menuOptions = Object.values(props.menuItems);

  useEffect(() => {
    props.onMenuItemSelect(selectedItem);
  }, [selectedItem]);

  return (
    <Box mb={4}>
      <Box as="label" display="block" mb={1}>
        {props.menuLabel}
      </Box>
      <Menu>
        <MenuButton as={Button} w="full">
          {selectedItem.name}
          <MdKeyboardArrowDown />
        </MenuButton>
        <MenuList>
          {menuOptions.map((item) => (
            <MenuItem key={item.name} onClick={() => setSelectedItem(item)}>
              {item.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default Dropdown;
