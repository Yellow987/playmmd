"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import PaginatedAssetGrid from "../mmd-generator/components/PaginatedAssetGrid";
import { ASSET_TYPE } from "../mmd-generator/components/AssetChooser/MmdAssetChooserModal";

export default function ManageAssetsPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>
        Manage Your Assets
      </Heading>

      <Tabs index={tabIndex} onChange={handleTabsChange} variant="enclosed">
        <TabList>
          <Tab>Models</Tab>
          <Tab>Motions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <PaginatedAssetGrid assetType="Models" />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <PaginatedAssetGrid assetType="Motions" />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
